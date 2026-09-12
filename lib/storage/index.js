import { uploadToCloudinary, deleteFromCloudinary, deleteFolderFromCloudinary } from './providers/cloudinary.js';
import { uploadToImageKit, deleteFromImageKit, deleteFolderFromImageKit, getImageKitAuth } from './providers/imagekit.js';
import { gdriveProvider } from './providers/gdrive.js';
import { isAllowedFileType, sanitizeFileName, MAX_FILE_BYTES, getFileTypeCategory } from './utils.js';


export { getImageKitAuth, isAllowedFileType, sanitizeFileName, MAX_FILE_BYTES, getFileTypeCategory };

/**
 * Upload file simultaneously to Cloudinary and ImageKit.
 * Returns Cloudinary URL as primary, while maintaining both references.
 *
 * @param {Buffer} buffer - File buffer
 * @param {Object} options - { fileName, mimeType, caseId }
 * @returns {Promise<{
 *   primaryUrl: string,
 *   storagePayload: string,
 *   cloudinary: Object,
 *   imagekit: Object
 * }>}
 */
export async function uploadFileDual(buffer, { fileName, mimeType, caseId, folderName }) {
  const cleanName = sanitizeFileName(fileName);
  const folder = caseId ? `/cases/${caseId}` : '/cases';
  const gdriveFolder = folderName || (caseId ? `/cases/${caseId}` : 'cases');

  // 1. Upload to Cloudinary & ImageKit (and Google Drive if configured) simultaneously
  const uploadPromises = [
    uploadToCloudinary(buffer, { fileName: cleanName, folder, mimeType }),
    uploadToImageKit(buffer, { fileName: cleanName, folder, mimeType }),
  ];

  const hasGDrive = gdriveProvider.isConfigured();
  if (hasGDrive) {
    uploadPromises.push(
      gdriveProvider.upload({ buffer, fileName: fileName || cleanName, mimeType, folder: gdriveFolder }).catch((err) => {
        console.warn('[GDrive Provider] Upload failed:', err);
        return null;
      })
    );
  }

  const [cloudResult, ikResult, gdriveResult] = await Promise.allSettled(uploadPromises);

  // Check results
  const cloudSuccess = cloudResult.status === 'fulfilled' ? cloudResult.value : null;
  const ikSuccess = ikResult.status === 'fulfilled' ? ikResult.value : null;
  const gdriveSuccess = gdriveResult && gdriveResult.status === 'fulfilled' ? gdriveResult.value : null;

  if (!cloudSuccess && !ikSuccess && !gdriveSuccess) {
    const errorMsg = [
      cloudResult.reason?.message ? `Cloudinary: ${cloudResult.reason.message}` : null,
      ikResult.reason?.message ? `ImageKit: ${ikResult.reason.message}` : null,
      gdriveResult?.reason?.message ? `GDrive: ${gdriveResult.reason.message}` : null,
    ]
      .filter(Boolean)
      .join(' | ');
    throw new Error(`Upload failed across providers. (${errorMsg || 'Unknown error'})`);
  }

  const isPdf =
    mimeType === 'application/pdf' ||
    cleanName.toLowerCase().endsWith('.pdf') ||
    cloudSuccess?.format === 'pdf';

  // Cloudinary URL is primary for images; For PDFs, prioritize ImageKit URL to avoid Cloudinary 401 account restriction
  const primaryUrl = isPdf
    ? ikSuccess?.url || cloudSuccess?.url || gdriveSuccess?.url
    : cloudSuccess?.url || ikSuccess?.url || gdriveSuccess?.url;
  const primaryFileId = cloudSuccess?.fileId || ikSuccess?.fileId || gdriveSuccess?.fileId;

  // Multi-storage payload structure storing all references
  const payloadObj = {
    version: 2,
    primary: isPdf && ikSuccess ? 'imagekit' : (cloudSuccess ? 'cloudinary' : (ikSuccess ? 'imagekit' : 'gdrive')),
    url: primaryUrl,
    fileId: primaryFileId,
    providers: {
      ...(cloudSuccess
        ? {
            cloudinary: {
              fileId: cloudSuccess.fileId,
              url: cloudSuccess.url,
              resourceType: cloudSuccess.resourceType || 'auto',
              format: cloudSuccess.format,
              bytes: cloudSuccess.bytes,
            },
          }
        : {}),
      ...(ikSuccess
        ? {
            imagekit: {
              fileId: ikSuccess.fileId,
              url: ikSuccess.url,
              filePath: ikSuccess.filePath,
            },
          }
        : {}),
      ...(gdriveSuccess
        ? {
            gdrive: {
              fileId: gdriveSuccess.fileId,
              url: gdriveSuccess.url,
              webViewLink: gdriveSuccess.webViewLink,
              webContentLink: gdriveSuccess.webContentLink,
            },
          }
        : {}),
    },
    // Direct backward-compatible alias keys
    cloudinary: cloudSuccess
      ? {
          fileId: cloudSuccess.fileId,
          url: cloudSuccess.url,
          resourceType: cloudSuccess.resourceType || 'auto',
        }
      : null,
    imagekit: ikSuccess
      ? {
          fileId: ikSuccess.fileId,
          url: ikSuccess.url,
          filePath: ikSuccess.filePath,
        }
      : null,
    gdrive: gdriveSuccess
      ? {
          fileId: gdriveSuccess.fileId,
          url: gdriveSuccess.url,
          webViewLink: gdriveSuccess.webViewLink,
        }
      : null,
  };

  return {
    primaryUrl,
    storagePayload: JSON.stringify(payloadObj),
    cloudinary: cloudSuccess,
    imagekit: ikSuccess,
    gdrive: gdriveSuccess,
    payloadObj,
  };
}

/**
 * Extract viewable URL from stored storage_path representation.
 */
export function extractFileUrl(storagePath) {
  if (!storagePath) return null;

  if (typeof storagePath === 'string' && storagePath.startsWith('{')) {
    try {
      const parsed = JSON.parse(storagePath);
      const isPdf =
        (parsed.url && parsed.url.toLowerCase().endsWith('.pdf')) ||
        parsed.providers?.cloudinary?.format === 'pdf' ||
        (parsed.providers?.imagekit?.url && parsed.providers.imagekit.url.toLowerCase().endsWith('.pdf')) ||
        (parsed.imagekit?.url && parsed.imagekit.url.toLowerCase().endsWith('.pdf'));

      // If PDF, prioritize ImageKit URL for seamless preview without Cloudinary 401 security restriction
      if (isPdf) {
        if (parsed.providers?.imagekit?.url) return parsed.providers.imagekit.url;
        if (parsed.imagekit?.url) return parsed.imagekit.url;
      }

      // Priority 1: Top-level primary URL
      if (parsed.url) return parsed.url;
      // Priority 2: Provider specific Cloudinary URL
      if (parsed.providers?.cloudinary?.url) return parsed.providers.cloudinary.url;
      if (parsed.cloudinary?.url) return parsed.cloudinary.url;
      // Priority 3: Provider specific ImageKit URL
      if (parsed.providers?.imagekit?.url) return parsed.providers.imagekit.url;
      if (parsed.imagekit?.url) return parsed.imagekit.url;
      // Priority 4: Provider specific Google Drive URL
      if (parsed.providers?.gdrive?.url) return parsed.providers.gdrive.url;
      if (parsed.gdrive?.url) return parsed.gdrive.url;
    } catch (_) {}
  }

  // Raw URL fallback
  if (typeof storagePath === 'string' && (storagePath.startsWith('http://') || storagePath.startsWith('https://'))) {
    return storagePath;
  }

  return null;
}


/**
 * Delete a file across all stored providers (Cloudinary, ImageKit, legacy Supabase).
 */
export async function deleteFileFromStorage(storagePath) {
  if (!storagePath) return;

  if (typeof storagePath === 'string' && storagePath.startsWith('{')) {
    try {
      const parsed = JSON.parse(storagePath);
      const deletionPromises = [];

      // Delete from Cloudinary if reference exists
      const cloudPublicId = parsed.providers?.cloudinary?.fileId || parsed.cloudinary?.fileId || (parsed.primary === 'cloudinary' ? parsed.fileId : null);
      const cloudResourceType = parsed.providers?.cloudinary?.resourceType || parsed.cloudinary?.resourceType || 'auto';
      if (cloudPublicId) {
        deletionPromises.push(
          deleteFromCloudinary(cloudPublicId, cloudResourceType).catch((err) => {
            console.error('Error deleting from Cloudinary:', err);
          })
        );
      }

      // Delete from ImageKit if reference exists
      const ikFileId = parsed.providers?.imagekit?.fileId || parsed.imagekit?.fileId || (parsed.primary !== 'cloudinary' && parsed.fileId ? parsed.fileId : null) || (parsed.fileId && !cloudPublicId ? parsed.fileId : null);
      if (ikFileId) {
        deletionPromises.push(
          deleteFromImageKit(ikFileId).catch((err) => {
            console.error('Error deleting from ImageKit:', err);
          })
        );
      }

      // Delete from Google Drive if reference exists
      const gdriveFileId = parsed.providers?.gdrive?.fileId || parsed.gdrive?.fileId;
      if (gdriveFileId && gdriveProvider.isConfigured()) {
        deletionPromises.push(gdriveProvider.delete({ fileId: gdriveFileId }).catch(() => {}));
      }

      await Promise.allSettled(deletionPromises);
      return;
    } catch (err) {
      console.error('Failed to parse storagePath JSON during deletion:', err);
    }
  }
}

/**
 * Delete all files and folder for a given case across storage providers.
 */
export async function deleteCaseStorage(caseId, caseFiles = []) {
  const promises = [];

  // Delete individual files first
  if (Array.isArray(caseFiles) && caseFiles.length > 0) {
    for (const file of caseFiles) {
      if (file.storage_path) {
        promises.push(deleteFileFromStorage(file.storage_path));
      }
    }
  }

  if (caseId) {
    const folderPath = `/cases/${caseId}`;
    promises.push(deleteFolderFromCloudinary(folderPath));
    promises.push(deleteFolderFromImageKit(folderPath));
    if (gdriveProvider.isConfigured()) {
      promises.push(gdriveProvider.deleteFolder(folderPath));
    }
  }

  await Promise.allSettled(promises);
}
