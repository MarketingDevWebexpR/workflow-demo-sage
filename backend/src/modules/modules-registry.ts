import { type Action } from './module.types';
import { sendEmailAction } from './emails/actions/send-email.action';

export const actionsMap: Record<string, Action> = {
	'ACTION_SEND_EMAIL': sendEmailAction,
	'ACTION_SEND_EMAIL_NOTIFICATION': sendEmailAction,
};

export const servicesMap: Record<string, () => Promise<any>> = {
	email: () => import('./emails/services/email.service'),
};
