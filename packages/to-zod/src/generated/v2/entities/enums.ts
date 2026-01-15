import { z } from 'zod';

export const PaymentMethodV2Schema = z.enum(['PIX', 'CARD']);

export type PaymentMethodV2 = z.infer<typeof PaymentMethodV2Schema>;

export const PaymentStatusV2Schema = z.enum(['PENDING', 'CANCELLED', 'PAID']);

export type PaymentStatusV2 = z.infer<typeof PaymentStatusV2Schema>;

export const WebhookEventTypeV2Schema = z.enum([
	'billing.paid',
	'payout.done',
	'payout.failed',
]);

export type WebhookEventTypeV2 = z.infer<typeof WebhookEventTypeV2Schema>;