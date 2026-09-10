'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function UploadFileForm({ caseId, caseNumber }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [error, setError] = useState(null);
  const formRef = useRef(null);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    const form = formRef.current;
    if (!form) return;

    const fileInput = form.querySelector('input[type="file"]');
    const file = fileInput?.files?.[0];

    if (!file) {
      setError('Please select a PDF file to upload.');
      return;
    }

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setError('Only PDF files can be uploaded.');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setError('File is too large (50MB maximum limit).');
      return;
    }

    setUploading(true);
    setProgress(0);
    setStatusText('Preparing upload…');

    try {
      // 1. Get authentication token from server
      const authRes = await fetch('/api/imagekit/auth');
      if (!authRes.ok) {
        throw new Error('Could not get upload authorization. Please ensure you are logged in as admin.');
      }
      const authData = await authRes.json();
      if (!authData.signature || !authData.token || !authData.expire) {
        throw new Error(authData.error || 'Failed to authenticate with ImageKit.');
      }

      // 2. Prepare FormData for direct ImageKit upload
      const ikFormData = new FormData();
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      ikFormData.append('file', file);
      ikFormData.append('fileName', cleanFileName);
      ikFormData.append('publicKey', authData.publicKey || process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || '');
      ikFormData.append('signature', authData.signature);
      ikFormData.append('expire', String(authData.expire));
      ikFormData.append('token', authData.token);
      ikFormData.append('folder', `/cases/${caseId}`);
      ikFormData.append('useUniqueFileName', 'true');

      // 3. Upload directly to ImageKit CDN with real progress tracking
      setStatusText('Uploading…');
      const ikResult = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://upload.imagekit.io/api/v1/files/upload');

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            setProgress(percent);
          }
        };

        xhr.onload = () => {
          try {
            const response = JSON.parse(xhr.responseText);
            if (xhr.status >= 200 && xhr.status < 300 && response.url) {
              resolve(response);
            } else {
              reject(new Error(response.message || response.error || 'ImageKit upload failed.'));
            }
          } catch (parseErr) {
            reject(new Error('Invalid response from upload server.'));
          }
        };

        xhr.onerror = () => {
          reject(new Error('Network error during upload to ImageKit.'));
        };

        xhr.send(ikFormData);
      });

      // 4. Register the uploaded file record in Supabase
      setStatusText('Saving file record…');
      const saveRes = await fetch('/api/cases/save-file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseId,
          caseNumber: caseNumber || '',
          fileId: ikResult.fileId,
          url: ikResult.url,
          filePath: ikResult.filePath,
          fileName: file.name,
          fileSize: file.size,
        }),
      });

      const saveData = await saveRes.json();
      if (!saveRes.ok || !saveData.success) {
        throw new Error(saveData.error || 'Failed to save file in database.');
      }

      // 5. Done! Reset and refresh server view
      form.reset();
      setProgress(0);
      setStatusText('');
      setUploading(false);
      router.refresh();
    } catch (err) {
      console.error('Upload process error:', err);
      setError(err.message || 'Upload failed. Please try again.');
      setUploading(false);
      setProgress(0);
      setStatusText('');
    }
  }

  return (
    <form onSubmit={handleSubmit} ref={formRef} className="dash-form">
      <input type="hidden" name="caseId" value={caseId} />
      <input type="hidden" name="caseNumber" value={caseNumber || ''} />
      <div className="upload-row">
        <div className="f">
          <label htmlFor="file">Upload Case File (PDF, up to 25MB)</label>
          <input id="file" name="file" type="file" accept="application/pdf,.pdf" required disabled={uploading} />
        </div>
        <button type="submit" className="btn btn-outline" disabled={uploading}>
          {uploading ? (progress > 0 && progress < 100 ? `Uploading ${progress}%…` : (statusText || 'Uploading…')) : 'Upload'}
        </button>
      </div>
      {error && <p className="dash-field-error" role="alert">{error}</p>}
    </form>
  );
}
