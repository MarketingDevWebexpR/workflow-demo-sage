/**
 * File Upload Test Component
 *
 * Tests file upload to Supabase Storage
 */

import { useState } from 'react';
import { supabase } from '../../../../lib/supabase';
import styles from './file-upload-test.module.scss';

const STORAGE_BUCKET = 'workflow-files';

export const FileUploadTest = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
    const [uploadedPath, setUploadedPath] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
            setError(null);
            setUploadedUrl(null);
            setUploadedPath(null);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setError('Please select a file');
            return;
        }

        setUploading(true);
        setError(null);

        try {
            // Generate a unique file path
            const timestamp = Date.now();
            const safeName = selectedFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
            const filePath = `documents/${timestamp}-${safeName}`;

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from(STORAGE_BUCKET)
                .upload(filePath, selectedFile, {
                    cacheControl: '3600',
                    upsert: false,
                });

            if (uploadError) {
                throw uploadError;
            }

            // Get the public URL
            const { data: urlData } = supabase.storage
                .from(STORAGE_BUCKET)
                .getPublicUrl(filePath);

            setUploadedUrl(urlData.publicUrl);
            setUploadedPath(filePath);
            console.log('File uploaded:', urlData.publicUrl);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
            console.error('Upload error:', err);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async () => {
        if (!uploadedPath) return;

        try {
            const { error: deleteError } = await supabase.storage
                .from(STORAGE_BUCKET)
                .remove([uploadedPath]);

            if (deleteError) {
                throw deleteError;
            }

            setUploadedUrl(null);
            setUploadedPath(null);
            setSelectedFile(null);
            console.log('File deleted');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error deleting file');
            console.error('Delete error:', err);
        }
    };

    return (
        <div className={styles.container}>
            <h2>Supabase Storage File Upload Test</h2>

            <div className={styles.uploadSection}>
                <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.png,.jpg,.jpeg,.webp,.gif,.svg"
                    disabled={uploading}
                />

                {selectedFile && (
                    <div className={styles.fileInfo}>
                        <p><strong>Selected file:</strong> {selectedFile.name}</p>
                        <p><strong>Size:</strong> {(selectedFile.size / 1024).toFixed(2)} KB</p>
                        <p><strong>Type:</strong> {selectedFile.type}</p>
                    </div>
                )}

                <button
                    onClick={handleUpload}
                    disabled={!selectedFile || uploading}
                >
                    {uploading ? 'Uploading...' : 'Upload file'}
                </button>
            </div>

            {error && (
                <div className={styles.error}>
                    Error: {error}
                </div>
            )}

            {uploadedUrl && (
                <div className={styles.success}>
                    <p>File uploaded successfully!</p>
                    <div className={styles.urlInfo}>
                        <p><strong>Path:</strong> <code>{uploadedPath}</code></p>
                        <p><strong>URL:</strong></p>
                        <code style={{ wordBreak: 'break-all' }}>{uploadedUrl}</code>
                    </div>

                    <div className={styles.actions}>
                        <button
                            onClick={() => window.open(uploadedUrl, '_blank')}
                        >
                            View file
                        </button>

                        <button onClick={handleDelete}>
                            Delete file
                        </button>
                    </div>

                    {uploadedUrl.match(/\.(png|jpg|jpeg|webp|gif)$/i) && (
                        <div className={styles.preview}>
                            <p><strong>Preview:</strong></p>
                            <img
                                src={uploadedUrl}
                                alt="Preview"
                                style={{ maxWidth: '100%', maxHeight: '400px', border: '1px solid #ccc' }}
                            />
                        </div>
                    )}
                </div>
            )}

            <div className={styles.instructions}>
                <h3>Instructions:</h3>
                <ol>
                    <li>Select a file (PDF, PNG, JPG, etc.)</li>
                    <li>Click "Upload file"</li>
                    <li>The file URL will appear above</li>
                    <li>You can view or delete the file</li>
                </ol>

                <h4>Supabase Storage Info:</h4>
                <ul>
                    <li><strong>Bucket:</strong> <code>{STORAGE_BUCKET}</code></li>
                    <li>Files are stored in Supabase Storage</li>
                    <li>Make sure the bucket exists and has proper RLS policies</li>
                </ul>
            </div>
        </div>
    );
};
