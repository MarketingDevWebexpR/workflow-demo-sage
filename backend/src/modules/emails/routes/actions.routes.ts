import { Hono } from 'hono';
import { sendEmailAction } from '../actions/send-email.action';

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
		const config = await c.req.json();
		const result = await sendEmailAction.execute(config);
		return c.json(result);
	} catch (error) {
		return c.json({
			success: false,
			error: error instanceof Error ? error.message : 'Server error',
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
		const validation = sendEmailAction.validate!(config);
		return c.json(validation);
	} catch (error) {
		return c.json({
			valid: false,
			errors: [error instanceof Error ? error.message : 'Server error'],
		}, 500);
	}
});

// ============================================================
// GET /api/actions/send-email/info
// Obtenir les infos sur cette brique (pour le UI Builder)
// ============================================================
app.get('/send-email/info', (c) => {
	return c.json({
		id: sendEmailAction.id,
		category: sendEmailAction.category,
	});
});

export default app;

