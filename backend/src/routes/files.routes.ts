import { Hono } from 'hono';
import { fileService } from '../services/file.service';

const app = new Hono();

/**
 * Upload un fichier
 * POST /api/files/upload
 * Body: FormData avec un champ 'file' et optionnellement 'folder'
 */
app.post('/upload', async (c) => {
  try {
    const body = await c.req.parseBody();
    const file = body['file'] as File;
    const folder = (body['folder'] as string) || 'documents';

    if (!file) {
      return c.json({ error: 'Aucun fichier fourni' }, 400);
    }

    // Validation du dossier
    if (!['avatars', 'documents'].includes(folder)) {
      return c.json({ error: 'Dossier invalide. Utilisez "avatars" ou "documents"' }, 400);
    }

    // Upload du fichier
    const url = await fileService.upload(file, folder as 'avatars' | 'documents');

    return c.json({
      success: true,
      url,
      message: 'Fichier uploadé avec succès',
    });
  } catch (error) {
    console.error('Erreur upload:', error);
    return c.json({
      error: error instanceof Error ? error.message : 'Erreur lors de l\'upload',
    }, 500);
  }
});

/**
 * Télécharger un fichier
 * GET /api/files/:folder/:filename
 */
app.get('/:folder/:filename', async (c) => {
  try {
    const { folder, filename } = c.req.param();
    const url = `${folder}/${filename}`;

    const buffer = await fileService.download(url);
    const mimeType = fileService.getMimeType(filename);

    return c.body(buffer, 200, {
      'Content-Type': mimeType,
      'Content-Disposition': `inline; filename="${filename}"`,
    });
  } catch (error) {
    console.error('Erreur téléchargement:', error);
    return c.json({
      error: error instanceof Error ? error.message : 'Fichier non trouvé',
    }, 404);
  }
});

/**
 * Supprimer un fichier
 * DELETE /api/files/:folder/:filename
 */
app.delete('/:folder/:filename', async (c) => {
  try {
    const { folder, filename } = c.req.param();
    const url = `${folder}/${filename}`;

    await fileService.delete(url);

    return c.json({
      success: true,
      message: 'Fichier supprimé avec succès',
    });
  } catch (error) {
    console.error('Erreur suppression:', error);
    return c.json({
      error: error instanceof Error ? error.message : 'Erreur lors de la suppression',
    }, 500);
  }
});

export default app;

