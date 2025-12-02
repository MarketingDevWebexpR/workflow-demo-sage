import { z } from 'zod';
import { type Action } from '../../module.types';

const SendEmailConfigSchema = z.object({
	to: z.string().email(),
	subject: z.string().min(1),
	message: z.string().min(1),
	from: z.string().email().optional(),
});

type SendEmailConfig = z.infer<typeof SendEmailConfigSchema>;

const SendEmailResultSchema = z.object({
	success: z.boolean(),
	messageId: z.string().optional(),
	sentAt: z.string().optional(),
	error: z.string().optional(),
});

type SendEmailResult = z.infer<typeof SendEmailResultSchema>;

export const sendEmailAction: Action<SendEmailConfig, SendEmailResult> = {
	id: 'ACTION_SEND_EMAIL',
	category: 'notifications',
	configSchema: SendEmailConfigSchema,
	resultSchema: SendEmailResultSchema,

	async execute(config) {
		try {
			const validConfig = SendEmailConfigSchema.parse(config);
			const { sendEmail, isEmailServiceConfigured } = await import('../services/email.service');

			if (!isEmailServiceConfigured()) {
				console.log('📧 Email simulé:', validConfig.to);
				return {
					success: true,
					messageId: `simulated_${Date.now()}`,
					sentAt: new Date().toISOString(),
				};
			}

			return await sendEmail({
				to: validConfig.to,
				subject: validConfig.subject,
				message: validConfig.message,
				from: validConfig.from,
			});
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error',
			};
		}
	},
};
