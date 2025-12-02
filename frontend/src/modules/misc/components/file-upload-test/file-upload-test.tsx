import { useState } from 'react';
import styles from './file-upload-test.module.scss';


export const FileUploadTest = () => {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [uploading, setUploading] = useState(false);
	const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setSelectedFile(e.target.files[0]);
			setError(null);
			setUploadedUrl(null);
		}
	};

	const handleUpload = async () => {
		if (!selectedFile) {
			setError('Veuillez sélectionner un fichier');
			return;
		}

		setUploading(true);
		setError(null);

		try {
			const formData = new FormData();
			formData.append('file', selectedFile);
			formData.append('folder', 'documents');

			const response = await fetch('http://localhost:3000/api/files/upload', {
				method: 'POST',
				body: formData,
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Erreur lors de l\'upload');
			}

			setUploadedUrl(data.url);
			console.log('✅ Fichier uploadé:', data.url);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Erreur inconnue');
			console.error('❌ Erreur upload:', err);
		} finally {
			setUploading(false);
		}
	};

	const handleDelete = async () => {
		if (!uploadedUrl) return;

		try {
			const response = await fetch(`http://localhost:3000/api/files/${uploadedUrl}`, {
				method: 'DELETE',
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Erreur lors de la suppression');
			}

			setUploadedUrl(null);
			setSelectedFile(null);
			console.log('✅ Fichier supprimé');
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
			console.error('❌ Erreur suppression:', err);
		}
	};

	return (
		<div className={styles.container}>
			<h2>Test d'Upload de Fichiers</h2>

			<div className={styles.uploadSection}>
				<input
					type="file"
					onChange={handleFileChange}
					accept=".pdf,.png,.jpg,.jpeg,.webp,.gif,.svg"
					disabled={uploading}
				/>

				{selectedFile && (
					<div className={styles.fileInfo}>
						<p><strong>Fichier sélectionné:</strong> {selectedFile.name}</p>
						<p><strong>Taille:</strong> {(selectedFile.size / 1024).toFixed(2)} KB</p>
						<p><strong>Type:</strong> {selectedFile.type}</p>
					</div>
				)}

				<button
					onClick={handleUpload}
					disabled={!selectedFile || uploading}
				>
					{uploading ? 'Upload en cours...' : 'Uploader le fichier'}
				</button>
			</div>

			{error && (
				<div className={styles.error}>
					❌ {error}
				</div>
			)}

			{uploadedUrl && (
				<div className={styles.success}>
					<p>✅ Fichier uploadé avec succès!</p>
					<div className={styles.urlInfo}>
						<p><strong>URL:</strong> <code>{uploadedUrl}</code></p>
						<p><strong>URL complète:</strong></p>
						<code>http://localhost:3000/api/files/{uploadedUrl}</code>
					</div>

					<div className={styles.actions}>
						<button
							onClick={() => window.open(`http://localhost:3000/api/files/${uploadedUrl}`, '_blank')}
						>
							📥 Télécharger/Voir le fichier
						</button>

						<button
							onClick={handleDelete}
						>
							🗑️ Supprimer le fichier
						</button>
					</div>

					{uploadedUrl.match(/\.(png|jpg|jpeg|webp|gif)$/i) && (
						<div className={styles.preview}>
							<p><strong>Aperçu:</strong></p>
							<img
								src={`http://localhost:3000/api/files/${uploadedUrl}`}
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
					<li>Sélectionnez un fichier (PDF, PNG, JPG, etc.)</li>
					<li>Cliquez sur "Uploader le fichier"</li>
					<li>L'URL du fichier apparaîtra ci-dessus</li>
					<li>Vous pouvez télécharger ou supprimer le fichier</li>
				</ol>

				<h4>Endpoints disponibles:</h4>
				<ul>
					<li><code>POST /api/files/upload</code> - Upload un fichier</li>
					<li><code>GET /api/files/:folder/:filename</code> - Télécharger un fichier</li>
					<li><code>DELETE /api/files/:folder/:filename</code> - Supprimer un fichier</li>
				</ul>
			</div>
		</div>
	);
};

