import { Hono } from 'hono';
import { SendEmailAction } from '../modules/emails/actions/send-email.action';

const app = new Hono();

/**
 * 🎯 API pour tester notre brique "Send Email"
 * 
 * Cette route permet de tester la brique sans avoir besoin d'un workflow complet
 */

// ============================================================
// POST /api/actions/send-email
// Exécuter la brique "Envoyer Email"
// ============================================================
app.post('/send-email', async (c) => {
	try {
		// 1. Récupérer la config depuis le body de la requête
		const config = await c.req.json();

		// 2. Créer une instance de la brique
		const action = new SendEmailAction();

		// 3. Exécuter la brique
		const result = await action.execute(config);

		// 4. Retourner le résultat
		return c.json(result);

	} catch (error) {
		return c.json({
			success: false,
			error: error instanceof Error ? error.message : 'Erreur serveur',
		}, 500);
	}
});

// ============================================================
// POST /api/actions/send-email/validate
// Valider une config SANS l'exécuter
// ============================================================
app.post('/send-email/validate', async (c) => {
	try {
		const config = await c.req.json();
		const action = new SendEmailAction();
		const validation = action.validate(config);
		
		return c.json(validation);

	} catch (error) {
		return c.json({
			valid: false,
			errors: [error instanceof Error ? error.message : 'Erreur serveur'],
		}, 500);
	}
});

// ============================================================
// GET /api/actions/send-email/info
// Obtenir les infos sur cette brique (pour le UI Builder)
// ============================================================
app.get('/send-email/info', (c) => {
	return c.json({
		id: SendEmailAction.id,
		title: SendEmailAction.title,
		description: SendEmailAction.description,
		icon: SendEmailAction.icon,
		category: SendEmailAction.category,
	});
});

export default app;

