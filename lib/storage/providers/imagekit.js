import ImageKit from 'imagekit';

let _imagekitInstance = null;

export function getImageKitClient() {
  if (_imagekitInstance) return _imagekitInstance;

  const publicKey =
    process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY ||
    process.env.IMAGEKIT_PUBLIC_KEY ||
    process.env.Public_key ||
    '';
  const privateKey =
    process.env.IMAGEKIT_PRIVATE_KEY ||
    process.env.Private_key ||
    process.env['Private key'] ||
    '';
  const urlEndpoint =
    process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT ||
    process.env.IMAGEKIT_URL_ENDPOINT ||
    process.env['URL-endpoint'] ||
    '';

  _imagekitInstance = new ImageKit({
    publicKey: publicKey || 'placeholder_public_key',
    privateKey: privateKey || 'placeholder_private_key',
    urlEndpoint: urlEndpoint || 'https://ik.imagekit.io/placeholder',
  });

  return _imagekitInstance;
}

/**
 * Upload a file buffer to ImageKit
 */
export async function uploadToImageKit(buffer, { fileName, folder }) {
  const cleanFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  const folderPath = folder ? (folder.startsWith('/') ? folder : `/${folder}`) : '/cases';
  const client = getImageKitClient();

  try {
    const result = await client.upload({
      file: buffer,
      fileName: cleanFileName,
      folder: folderPath,
      useUniqueFileName: true,
    });

    return {
      provider: 'imagekit',
      fileId: result.fileId,
      url: result.url,
      filePath: result.filePath,
      raw: result,
    };
  } catch (error) {
    console.error('[ImageKit Provider] Upload error:', error);
    throw error;
  }
}

/**
 * Delete a file from ImageKit by fileId
 */
export async function deleteFromImageKit(fileId) {
  if (!fileId) return;
  try {
    const client = getImageKitClient();
    return await client.deleteFile(fileId);
  } catch (err) {
    console.error('[ImageKit Provider] Delete error:', err);
    throw err;
  }
}

/**
 * Delete a folder in ImageKit
 */
export async function deleteFolderFromImageKit(folderPath) {
  if (!folderPath) return;
  const cleanFolder = folderPath.startsWith('/') ? folderPath : `/${folderPath}`;
  try {
    const client = getImageKitClient();
    return await client.deleteFolder(cleanFolder);
  } catch (err) {
    console.error('[ImageKit Provider] Delete folder error:', err);
  }
}

/**
 * Get client upload auth parameters
 */
export function getImageKitAuth() {
  const client = getImageKitClient();
  const publicKey =
    process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY ||
    process.env.IMAGEKIT_PUBLIC_KEY ||
    process.env.Public_key ||
    '';

  return {
    ...client.getAuthenticationParameters(),
    publicKey,
  };
}

export default getImageKitClient;

