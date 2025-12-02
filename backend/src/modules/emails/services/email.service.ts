import { Resend } from 'resend';

/**
 * 📧 Service d'envoi d'emails avec Resend
 * 
 * Resend est une API moderne pour envoyer des emails
 * - Simple à utiliser
 * - 3000 emails gratuits/mois
 * - Parfait pour tester
 */

// Créer une instance de Resend avec votre clé API
const resend = new Resend(process.env.RESEND_API_KEY);

export interface SendEmailParams {
	to: string | string[];
	subject: string;
	message: string; // Texte brut
	html?: string; // HTML (optionnel)
	from?: string;
}

export interface SendEmailResponse {
	success: boolean;
	messageId?: string;
	sentAt?: string;
	error?: string;
}

/**
 * Envoyer un email via Resend
 */
export async function sendEmail(params: SendEmailParams): Promise<SendEmailResponse> {
	try {
		// Email de l'expéditeur (par défaut ou custom)
		const fromEmail = params.from || process.env.DEFAULT_FROM_EMAIL || 'onboarding@resend.dev';

		// Envoyer l'email
		const { data, error } = await resend.emails.send({
			from: fromEmail,
			to: Array.isArray(params.to) ? params.to : [params.to],
			subject: params.subject,
			text: params.message, // Version texte
			html: params.html || `<p>${params.message}</p>`, // Version HTML
		});

		// Gérer les erreurs
		if (error) {
			console.error('❌ Erreur Resend:', error);
			return {
				success: false,
				error: error.message,
			};
		}

		// Succès !
		console.log('✅ Email envoyé avec succès:', data?.id);
		return {
			success: true,
			messageId: data?.id,
			sentAt: new Date().toISOString(),
		};

	} catch (error) {
		console.error('❌ Erreur lors de l\'envoi:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Erreur inconnue',
		};
	}
}

/**
 * Vérifier si le service email est configuré
 */
export function isEmailServiceConfigured(): boolean {
	return !!process.env.RESEND_API_KEY;
}

