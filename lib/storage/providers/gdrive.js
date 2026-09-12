import { google } from 'googleapis';
import { Readable } from 'stream';

function cleanFolderId(input) {
  if (!input) return '';
  const trimmed = String(input).trim();
  const match = trimmed.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (match) return match[1];
  return trimmed.split('?')[0].replace(/^\/+|\/+$/g, '');
}

/**
 * Google Drive Storage Provider
 * Supports uploading, sharing, and deleting files via Google Drive API v3
 */
export class GoogleDriveProvider {
  constructor(config = {}) {
    this.name = 'gdrive';
    this.clientId = config.clientId || process.env.GOOGLE_DRIVE_CLIENT_ID || '';
    this.clientSecret = config.clientSecret || process.env.GOOGLE_DRIVE_CLIENT_SECRET || '';
    this.refreshToken = config.refreshToken || process.env.GOOGLE_DRIVE_REFRESH_TOKEN || '';
    this.folderId = cleanFolderId(config.folderId || process.env.GOOGLE_DRIVE_FOLDER_ID || '');
    this._driveClient = null;
    this._folderCache = new Map();
  }

  isConfigured() {
    const clientId = this.clientId || process.env.GOOGLE_DRIVE_CLIENT_ID;
    const clientSecret = this.clientSecret || process.env.GOOGLE_DRIVE_CLIENT_SECRET;
    const refreshToken = this.refreshToken || process.env.GOOGLE_DRIVE_REFRESH_TOKEN;
    return Boolean(clientId && clientSecret && refreshToken);
  }

  getDriveClient() {
    if (this._driveClient) return this._driveClient;

    const clientId = this.clientId || process.env.GOOGLE_DRIVE_CLIENT_ID;
    const clientSecret = this.clientSecret || process.env.GOOGLE_DRIVE_CLIENT_SECRET;
    const refreshToken = this.refreshToken || process.env.GOOGLE_DRIVE_REFRESH_TOKEN;

    if (!clientId || !clientSecret || !refreshToken) {
      throw new Error('Google Drive credentials are not fully configured in environment variables.');
    }

    const oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      'https://developers.google.com/oauthplayground'
    );

    oauth2Client.setCredentials({
      refresh_token: refreshToken,
    });

    this._driveClient = google.drive({ version: 'v3', auth: oauth2Client });
    return this._driveClient;
  }

  /**
   * Resolve or create a subfolder in Google Drive
   */
  async getOrCreateFolder(folderPath, baseParentId) {
    if (!folderPath) return baseParentId || null;

    // If it's already a raw Google Drive ID (e.g. 1PsPv1jSIV7W0BkMHYT0NpJFbInjR0uhW)
    if (/^[a-zA-Z0-9_-]{25,60}$/.test(folderPath) && !folderPath.includes(' ') && !folderPath.startsWith('Case')) {
      return folderPath;
    }

    // Extract subfolder name from path or use full descriptive name
    const segments = folderPath.split('/').filter(Boolean);
    const subfolderName = segments.length > 0 ? segments[segments.length - 1] : 'cases';
    const cacheKey = `${baseParentId || 'root'}_${subfolderName}`;

    if (this._folderCache.has(cacheKey)) {
      return this._folderCache.get(cacheKey);
    }

    try {
      const drive = this.getDriveClient();
      let query = `name = '${subfolderName.replace(/'/g, "\\'")}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`;
      if (baseParentId) {
        query += ` and '${baseParentId}' in parents`;
      }

      const res = await drive.files.list({
        q: query,
        fields: 'files(id, name)',
        spaces: 'drive',
      });

      if (res.data.files && res.data.files.length > 0) {
        const existingId = res.data.files[0].id;
        this._folderCache.set(cacheKey, existingId);
        return existingId;
      }

      // Create new subfolder
      const folderMetadata = {
        name: subfolderName,
        mimeType: 'application/vnd.google-apps.folder',
        parents: baseParentId ? [baseParentId] : [],
      };

      const created = await drive.files.create({
        requestBody: folderMetadata,
        fields: 'id',
      });

      const newId = created.data.id;
      this._folderCache.set(cacheKey, newId);
      return newId;
    } catch (err) {
      console.warn('[GoogleDrive Provider] Failed to create/find subfolder, using base folder:', err.message);
      return baseParentId || null;
    }
  }

  /**
   * Upload a file buffer to Google Drive
   * @param {Object} params
   * @param {Buffer} params.buffer - File buffer
   * @param {string} params.fileName - File name
   * @param {string} [params.mimeType] - Mime type of the file
   * @param {string} [params.folder] - Optional folder name/id
   */
  async upload({ buffer, fileName, mimeType = 'application/octet-stream', folder }) {
    if (!this.isConfigured()) {
      console.info('[GoogleDrive Provider] Not configured, skipping GDrive upload.');
      return null;
    }

    try {
      const drive = this.getDriveClient();
      const baseRootId = this.folderId || cleanFolderId(process.env.GOOGLE_DRIVE_FOLDER_ID);
      
      // Resolve subfolder if a folder path was provided
      let targetFolderId = baseRootId;
      if (folder) {
        targetFolderId = await this.getOrCreateFolder(folder, baseRootId);
      }

      const fileMetadata = {
        name: fileName,
        parents: targetFolderId ? [targetFolderId] : [],
      };

      const media = {
        mimeType: mimeType || 'application/octet-stream',
        body: Readable.from(buffer),
      };

      const response = await drive.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: 'id, name, webViewLink, webContentLink, mimeType, size',
      });

      const fileData = response.data;

      // Make the uploaded file viewable via link
      try {
        await drive.permissions.create({
          fileId: fileData.id,
          requestBody: {
            role: 'reader',
            type: 'anyone',
          },
        });
      } catch (permErr) {
        console.warn('[GoogleDrive Provider] Notice: Could not set public permission:', permErr.message);
      }

      return {
        provider: 'gdrive',
        fileId: fileData.id,
        url: fileData.webViewLink || fileData.webContentLink,
        webViewLink: fileData.webViewLink,
        webContentLink: fileData.webContentLink,
        fileName: fileData.name,
        mimeType: fileData.mimeType,
        raw: fileData,
      };
    } catch (error) {
      console.error('[GoogleDrive Provider] Upload error:', error);
      throw error;
    }
  }

  /**
   * Delete a file from Google Drive by fileId
   */
  async delete({ fileId }) {
    if (!this.isConfigured() || !fileId) return;
    try {
      const drive = this.getDriveClient();
      await drive.files.delete({ fileId });
      return true;
    } catch (error) {
      console.error('[GoogleDrive Provider] Delete error:', error);
      throw error;
    }
  }

  /**
   * Delete a folder from Google Drive by folderId or folderPath
   */
  async deleteFolder(folderIdentifier) {
    if (!this.isConfigured() || !folderIdentifier) return;
    try {
      const drive = this.getDriveClient();
      let targetId = folderIdentifier;

      // If it's a path like "/cases/xxx"
      if (folderIdentifier.includes('/')) {
        const baseRootId = this.folderId || cleanFolderId(process.env.GOOGLE_DRIVE_FOLDER_ID);
        const segments = folderIdentifier.split('/').filter(Boolean);
        const subfolderName = segments.length > 0 ? segments[segments.length - 1] : '';
        if (!subfolderName) return;

        let query = `name = '${subfolderName.replace(/'/g, "\\'")}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`;
        if (baseRootId) query += ` and '${baseRootId}' in parents`;

        const res = await drive.files.list({ q: query, fields: 'files(id)' });
        if (res.data.files && res.data.files.length > 0) {
          targetId = res.data.files[0].id;
        } else {
          return;
        }
      }

      await drive.files.delete({ fileId: targetId });
      return true;
    } catch (error) {
      console.error('[GoogleDrive Provider] Delete folder error:', error);
    }
  }
}

export const gdriveProvider = new GoogleDriveProvider();
export default gdriveProvider;
