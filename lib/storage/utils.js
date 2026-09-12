/**
 * File validation and utility helpers for Storage
 */

export const MAX_FILE_BYTES = 50 * 1024 * 1024; // 50MB

export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'image/bmp',
  'image/tiff',
];

export const ALLOWED_EXTENSIONS = [
  '.pdf',
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.gif',
  '.svg',
  '.bmp',
  '.tiff',
];

export function sanitizeFileName(name) {
  if (!name) return `file_${Date.now()}`;
  return name.replace(/[^a-zA-Z0-9._-]/g, '_');
}

export function isAllowedFileType(file) {
  if (!file) return false;
  const fileName = (file.name || '').toLowerCase();
  const fileType = (file.type || '').toLowerCase();

  const isPdf = fileType === 'application/pdf' || fileName.endsWith('.pdf');
  const isImage = fileType.startsWith('image/') || ALLOWED_EXTENSIONS.some((ext) => fileName.endsWith(ext) && ext !== '.pdf');

  return isPdf || isImage;
}

export function getFileTypeCategory(fileName = '', mimeType = '') {
  const name = fileName.toLowerCase();
  const type = mimeType.toLowerCase();

  if (type === 'application/pdf' || name.endsWith('.pdf')) {
    return 'pdf';
  }
  if (
    type.startsWith('image/') ||
    ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.bmp'].some((ext) => name.endsWith(ext))
  ) {
    return 'image';
  }
  return 'file';
}
