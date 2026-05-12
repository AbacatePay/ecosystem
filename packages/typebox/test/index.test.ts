import { describe, expect, test } from 'bun:test';
import { Value } from '@sinclair/typebox/value';
import {
	RESTPostCreateTransparentCheckoutBody,
	RESTPostCreateTransparentCheckoutBoletoData,
	RESTPostCreateTransparentCheckoutPixData,
} from '../src/v2';

describe('transparent checkout schemas', () => {
	test('accepts a PIX transparent checkout payload', () => {
		expect(
			Value.Check(RESTPostCreateTransparentCheckoutBody, {
				method: 'PIX',
				data: {
					amount: 10_000,
					description: 'Cobrança PIX no checkout transparente',
					expiresIn: 3600,
					metadata: {
						pedidoId: 'pedido-123',
					},
					utm: {
						source: 'newsletter',
						medium: 'email',
					},
				},
			}),
		).toBe(true);
	});

	test('accepts a BOLETO transparent checkout payload', () => {
		expect(
			Value.Check(RESTPostCreateTransparentCheckoutBody, {
				method: 'BOLETO',
				data: {
					amount: 25_000,
					description: 'Fatura de serviço mensal',
					customer: {
						name: 'Mariana Costa',
						taxId: '987.654.321-00',
					},
					interest: { value: 100 },
					fine: { value: 1000, type: 'FIXED' },
				},
			}),
		).toBe(true);
	});

	test('requires boleto customer name and taxId', () => {
		expect(
			Value.Check(RESTPostCreateTransparentCheckoutBody, {
				method: 'BOLETO',
				data: {
					amount: 25_000,
				},
			}),
		).toBe(false);
	});

	test('keeps the direct PIX data schema available', () => {
		expect(
			Value.Check(RESTPostCreateTransparentCheckoutPixData, {
				amount: 10_000,
				externalId: 'order-123',
			}),
		).toBe(true);
	});

	test('keeps the direct BOLETO data schema available', () => {
		expect(
			Value.Check(RESTPostCreateTransparentCheckoutBoletoData, {
				amount: 25_000,
				customer: {
					name: 'Mariana Costa',
					taxId: '987.654.321-00',
				},
			}),
		).toBe(true);
	});
});
