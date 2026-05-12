import { describe, expect, test } from 'bun:test';
import {
	PaymentMethod,
	PaymentStatus,
	type RESTPostCreateTransparentCheckoutBody,
	Routes,
} from '../types/v2';

describe('transparent checkout types', () => {
	test('supports PIX and BOLETO creation bodies', () => {
		const pixBody = {
			method: PaymentMethod.Pix,
			data: {
				amount: 10_000,
				utm: {
					source: 'newsletter',
				},
			},
		} satisfies RESTPostCreateTransparentCheckoutBody;

		const boletoBody = {
			method: PaymentMethod.Boleto,
			data: {
				amount: 25_000,
				customer: {
					name: 'Mariana Costa',
					taxId: '987.654.321-00',
				},
				fine: {
					value: 1000,
					type: 'FIXED',
				},
			},
		} satisfies RESTPostCreateTransparentCheckoutBody;

		expect(pixBody.method).toBe('PIX');
		expect(boletoBody.method).toBe('BOLETO');
	});

	test('builds transparent checkout list routes with filters', () => {
		expect(
			Routes.transparents.list({
				after: 'cursor-next',
				limit: 25,
				status: PaymentStatus.Paid,
			}),
		).toBe('/transparents/list?limit=25&after=cursor-next&status=PAID');
	});
});
