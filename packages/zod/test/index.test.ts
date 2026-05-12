import { describe, expect, test } from 'bun:test';
import {
	RESTPostCreateTransparentCheckoutBody,
	RESTPostCreateTransparentCheckoutBoletoData,
	RESTPostCreateTransparentCheckoutPixData,
} from '../src/v2';

describe('transparent checkout schemas', () => {
	test('accepts a PIX transparent checkout payload', () => {
		const result = RESTPostCreateTransparentCheckoutBody.safeParse({
			method: 'PIX',
			data: {
				amount: 10_000,
				description: 'Cobrança PIX no checkout transparente',
				expiresIn: 3600,
				customer: {
					name: 'Daniel Lima',
					email: 'daniel_lima@abacatepay.com',
					taxId: '123.456.789-01',
					cellphone: '(11) 4002-8922',
				},
				metadata: {
					pedidoId: 'pedido-123',
				},
				utm: {
					source: 'newsletter',
					medium: 'email',
				},
			},
		});

		expect(result.success).toBe(true);
	});

	test('accepts a BOLETO transparent checkout payload', () => {
		const result = RESTPostCreateTransparentCheckoutBody.safeParse({
			method: 'BOLETO',
			data: {
				amount: 25_000,
				description: 'Fatura de serviço mensal',
				customer: {
					name: 'Mariana Costa',
					taxId: '987.654.321-00',
					email: 'mariana.costa@empresa.com.br',
				},
				interest: { value: 100 },
				fine: { value: 1000, type: 'FIXED' },
			},
		});

		expect(result.success).toBe(true);
	});

	test('requires boleto customer name and taxId', () => {
		const result = RESTPostCreateTransparentCheckoutBody.safeParse({
			method: 'BOLETO',
			data: {
				amount: 25_000,
			},
		});

		expect(result.success).toBe(false);
	});

	test('keeps the direct PIX data schema available', () => {
		expect(
			RESTPostCreateTransparentCheckoutPixData.safeParse({
				amount: 10_000,
				externalId: 'order-123',
			}).success,
		).toBe(true);
	});

	test('keeps the direct BOLETO data schema available', () => {
		expect(
			RESTPostCreateTransparentCheckoutBoletoData.safeParse({
				amount: 25_000,
				customer: {
					name: 'Mariana Costa',
					taxId: '987.654.321-00',
				},
			}).success,
		).toBe(true);
	});
});
