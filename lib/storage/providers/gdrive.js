/**
 * Google Drive Storage Provider
 * Modular adapter architecture for future Google Drive integration
 */

export class GoogleDriveProvider {
  constructor(config = {}) {
    this.name = 'gdrive';
    this.clientId = config.clientId || process.env.GOOGLE_DRIVE_CLIENT_ID || '';
    this.clientSecret = config.clientSecret || process.env.GOOGLE_DRIVE_CLIENT_SECRET || '';
    this.refreshToken = config.refreshToken || process.env.GOOGLE_DRIVE_REFRESH_TOKEN || '';
    this.folderId = config.folderId || process.env.GOOGLE_DRIVE_FOLDER_ID || '';
  }

  isConfigured() {
    return Boolean(this.clientId && this.clientSecret && this.refreshToken);
  }

  async upload({ buffer, fileName, mimeType, folder }) {
    if (!this.isConfigured()) {
      // Future ready: Google Drive will automatically activate once credentials are provided
      console.info('[GoogleDrive Provider] Not configured, skipping GDrive upload.');
      return null;
    }

    // Modular placeholder for googleapis drive.files.create
    throw new Error('Google Drive integration will be enabled when credentials are fully configured.');
  }

  async delete({ fileId }) {
    if (!this.isConfigured() || !fileId) return;
    // Modular placeholder for googleapis drive.files.delete
  }

  async deleteFolder(folderId) {
    if (!this.isConfigured() || !folderId) return;
    // Modular placeholder for googleapis folder deletion
  }
}

export const gdriveProvider = new GoogleDriveProvider();
export default gdriveProvider;
