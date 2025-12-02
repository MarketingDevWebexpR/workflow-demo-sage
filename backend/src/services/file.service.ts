import { writeFile, unlink, readFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { fileTypeFromBuffer } from 'file-type';
import { existsSync } from 'fs';

export class FileService {
  private uploadDir = join(process.cwd(), 'uploads');

  constructor() {
    // S'assurer que les dossiers existent
    this.ensureDirectoriesExist();
  }

  private async ensureDirectoriesExist() {
    const folders = ['avatars', 'documents'];
    for (const folder of folders) {
      const path = join(this.uploadDir, folder);
      if (!existsSync(path)) {
        await mkdir(path, { recursive: true });
      }
    }
  }

  /**
   * Upload un fichier dans le système de fichiers local
   * @param file - Le fichier à uploader
   * @param folder - Le dossier de destination ('avatars' | 'documents')
   * @returns L'URL relative du fichier uploadé
   */
  async upload(file: File, folder: 'avatars' | 'documents'): Promise<string> {
    // Validation du type de fichier
    const buffer = Buffer.from(await file.arrayBuffer());
    const type = await fileTypeFromBuffer(buffer);

    const allowedTypes = ['png', 'jpg', 'jpeg', 'pdf', 'webp', 'gif', 'svg'];
    
    if (!type || !allowedTypes.includes(type.ext)) {
      throw new Error(`Type de fichier invalide. Types autorisés: ${allowedTypes.join(', ')}`);
    }

    // Génération d'un nom de fichier unique
    const fileName = `${Date.now()}-${this.sanitize(file.name)}`;
    const filePath = join(this.uploadDir, folder, fileName);

    // Sauvegarde du fichier
    await writeFile(filePath, buffer);

    // Retourne l'URL relative
    return `${folder}/${fileName}`;
  }

  /**
   * Télécharge un fichier depuis le système de fichiers
   * @param url - L'URL relative du fichier (ex: "documents/123456-file.pdf")
   * @returns Le buffer du fichier
   */
  async download(url: string): Promise<Buffer> {
    const filePath = join(this.uploadDir, url);
    
    if (!existsSync(filePath)) {
      throw new Error('Fichier non trouvé');
    }

    return await readFile(filePath);
  }

  /**
   * Supprime un fichier du système de fichiers
   * @param url - L'URL relative du fichier
   */
  async delete(url: string): Promise<void> {
    const filePath = join(this.uploadDir, url);
    
    if (!existsSync(filePath)) {
      throw new Error('Fichier non trouvé');
    }

    await unlink(filePath);
  }

  /**
   * Sanitize le nom de fichier (supprime les accents et caractères spéciaux)
   * @param name - Le nom original du fichier
   * @returns Le nom sanitizé
   */
  private sanitize(name: string): string {
    return name
      .normalize('NFD') // Décompose les accents
      .replace(/[\u0300-\u036f]/g, '') // Supprime les diacritiques
      .replace(/[^a-zA-Z0-9.-]/g, '_') // Remplace les caractères spéciaux par _
      .toLowerCase();
  }

  /**
   * Obtient le MIME type basé sur l'extension du fichier
   * @param fileName - Le nom du fichier
   * @returns Le MIME type
   */
  getMimeType(fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase();
    const mimeTypes: Record<string, string> = {
      'pdf': 'application/pdf',
      'png': 'image/png',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'gif': 'image/gif',
      'webp': 'image/webp',
      'svg': 'image/svg+xml',
    };
    return mimeTypes[ext || ''] || 'application/octet-stream';
  }
}

// Export une instance singleton
export const fileService = new FileService();

