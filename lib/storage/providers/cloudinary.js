import { v2 as cloudinary } from 'cloudinary';

export function getCloudinaryClient() {
  cloudinary.config({
    cloud_name:
      process.env.CLOUDINARY_CLOUD_NAME ||
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
      'z9k7qar8',
    api_key:
      process.env.CLOUDINARY_API_KEY ||
      process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY ||
      '849612657253566',
    api_secret:
      process.env.CLOUDINARY_API_SECRET ||
      process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET ||
      '',
    secure: true,
  });
  return cloudinary;
}

/**
 * Upload a file buffer to Cloudinary
 * Handles both images and PDFs/documents seamlessly
 */
export async function uploadToCloudinary(buffer, { fileName, folder, mimeType }) {
  const client = getCloudinaryClient();
  return new Promise((resolve, reject) => {
    const cleanBaseName = fileName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
    const folderPath = folder ? folder.replace(/^\//, '') : 'cases';

    const uploadStream = client.uploader.upload_stream(

      {
        folder: folderPath,
        public_id: `${cleanBaseName}_${Date.now()}`,
        resource_type: 'auto',
        use_filename: true,
        unique_filename: true,
      },
      (error, result) => {
        if (error) {
          console.error('[Cloudinary Provider] Upload error:', error);
          return reject(error);
        }
        resolve({
          provider: 'cloudinary',
          fileId: result.public_id,
          url: result.secure_url || result.url,
          resourceType: result.resource_type,
          format: result.format,
          bytes: result.bytes,
          raw: result,
        });
      }
    );

    uploadStream.end(buffer);
  });
}

/**
 * Delete a file from Cloudinary by publicId
 */
export async function deleteFromCloudinary(publicId, resourceType = 'auto') {
  if (!publicId) return;
  const client = getCloudinaryClient();

  try {
    if (resourceType === 'auto') {
      // Attempt image deletion first, then raw deletion if not found
      const res = await client.uploader.destroy(publicId, { resource_type: 'image' });
      if (res.result === 'ok') return res;
      return await client.uploader.destroy(publicId, { resource_type: 'raw' });
    }
    return await client.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (err) {
    console.error('[Cloudinary Provider] Delete error:', err);
    throw err;
  }
}

/**
 * Delete a folder and its contents in Cloudinary
 */
export async function deleteFolderFromCloudinary(folderPath) {
  if (!folderPath) return;
  const cleanFolder = folderPath.replace(/^\//, '');
  const client = getCloudinaryClient();

  try {
    await client.api.delete_resources_by_prefix(cleanFolder, { resource_type: 'image' }).catch(() => {});
    await client.api.delete_resources_by_prefix(cleanFolder, { resource_type: 'raw' }).catch(() => {});
    await client.api.delete_folder(cleanFolder).catch(() => {});
  } catch (err) {
    console.error('[Cloudinary Provider] Delete folder error:', err);
  }
}

export default cloudinary;

