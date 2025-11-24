import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { View } from '../models/View.model';

const views = new Hono();

// CORS pour permettre les appels depuis le frontend
views.use('/*', cors());

// GET /api/workflows/:workflowId/views - Récupérer toutes les vues d'un workflow
views.get('/:workflowId/views', async (c) => {
	try {
		const workflowId = c.req.param('workflowId');
		const allViews = await View.find({ workflowId }).sort({ stepId: 1 });
		
		return c.json({
			success: true,
			data: allViews.map(v => v.toJSON()),
			count: allViews.length,
		});
	} catch (error) {
		return c.json({
			success: false,
			error: error instanceof Error ? error.message : 'Erreur inconnue',
		}, 500);
	}
});

// GET /api/workflows/:workflowId/views/:stepId - Récupérer l'IHM d'une étape spécifique
views.get('/:workflowId/views/:stepId', async (c) => {
	try {
		const workflowId = c.req.param('workflowId');
		const stepId = c.req.param('stepId');
		
		const view = await View.findOne({ workflowId, stepId });
		
		if (!view) {
			// La vue n'existe pas encore - retourner success: true mais sans _id
			// Le frontend détectera l'absence de _id et créera automatiquement la vue
			return c.json({
				success: true,
				exists: false,
				data: {
					workflowId,
					stepId,
					components: '[]',
				},
			});
		}
		
		return c.json({
			success: true,
			exists: true,
			data: view.toJSON(),
		});
	} catch (error) {
		return c.json({
			success: false,
			error: error instanceof Error ? error.message : 'Erreur inconnue',
		}, 500);
	}
});

// PUT /api/workflows/:workflowId/views/:stepId - Créer ou mettre à jour l'IHM d'une étape
views.put('/:workflowId/views/:stepId', async (c) => {
	try {
		const workflowId = c.req.param('workflowId');
		const stepId = c.req.param('stepId');
		const body = await c.req.json();
		
		if (!body.components) {
			return c.json({
				success: false,
				error: 'Le champ "components" est requis',
			}, 400);
		}
		
		// Upsert : créer si n'existe pas, mettre à jour sinon
		const view = await View.findOneAndUpdate(
			{ workflowId, stepId },
			{ components: body.components },
			{ new: true, upsert: true, runValidators: true }
		);
		
		return c.json({
			success: true,
			data: view.toJSON(),
			message: 'Vue sauvegardée avec succès',
		});
	} catch (error) {
		return c.json({
			success: false,
			error: error instanceof Error ? error.message : 'Erreur inconnue',
		}, 500);
	}
});

// DELETE /api/workflows/:workflowId/views/:stepId - Supprimer l'IHM d'une étape
views.delete('/:workflowId/views/:stepId', async (c) => {
	try {
		const workflowId = c.req.param('workflowId');
		const stepId = c.req.param('stepId');
		
		const view = await View.findOneAndDelete({ workflowId, stepId });
		
		if (!view) {
			return c.json({
				success: false,
				error: 'Vue non trouvée',
			}, 404);
		}
		
		return c.json({
			success: true,
			message: 'Vue supprimée avec succès',
		});
	} catch (error) {
		return c.json({
			success: false,
			error: error instanceof Error ? error.message : 'Erreur inconnue',
		}, 500);
	}
});

// DELETE /api/workflows/:workflowId/views - Supprimer TOUTES les vues d'un workflow
views.delete('/:workflowId/views', async (c) => {
	try {
		const workflowId = c.req.param('workflowId');
		
		const result = await View.deleteMany({ workflowId });
		
		return c.json({
			success: true,
			message: `${result.deletedCount} vue(s) supprimée(s) avec succès`,
			deletedCount: result.deletedCount,
		});
	} catch (error) {
		return c.json({
			success: false,
			error: error instanceof Error ? error.message : 'Erreur inconnue',
		}, 500);
	}
});

export default views;

