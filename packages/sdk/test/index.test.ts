import { afterEach, describe, expect, mock, test } from 'bun:test';
import { AbacatePay } from '../src';
import { AbacatePay as AbacatePayV1 } from '../src/v1';

const jsonResponse = (body: unknown, status = 200) =>
	new Response(JSON.stringify(body), {
		status,
		headers: { 'Content-Type': 'application/json' },
	});

const originalFetch = globalThis.fetch;
const originalWarn = console.warn;

afterEach(() => {
	globalThis.fetch = originalFetch;
	console.warn = originalWarn;
});

describe('AbacatePay (v2)', () => {
	test('customers.get builds the right request and returns the response untouched', async () => {
		const fetchSpy = mock(async (url: string) => {
			expect(url).toBe(
				'https://api.abacatepay.com/v2/customers/get?id=cust_123',
			);

			return jsonResponse({
				data: { id: 'cust_123', email: 'foo@bar.com' },
				error: null,
				success: true,
			});
		});
		globalThis.fetch = fetchSpy as typeof fetch;

		const abacate = AbacatePay({ secret: 'sk_test' });
		const result = await abacate.customers.get('cust_123');

		expect(result).toEqual({
			data: { id: 'cust_123', email: 'foo@bar.com' },
			error: null,
			success: true,
		});
	});

	test('checkouts.create posts the body as-is and never throws on an API error', async () => {
		const fetchSpy = mock(async (url: string, init?: RequestInit) => {
			expect(url).toBe('https://api.abacatepay.com/v2/checkouts/create');
			expect(init?.method).toBe('POST');
			expect(JSON.parse(init?.body as string)).toEqual({
				items: [{ id: 'prod_123', quantity: 1 }],
			});

			return jsonResponse(
				{ data: null, error: 'Invalid item', success: false },
				400,
			);
		});
		globalThis.fetch = fetchSpy as typeof fetch;

		const abacate = AbacatePay({ secret: 'sk_test' });
		const result = await abacate.checkouts.create({
			items: [{ id: 'prod_123', quantity: 1 }],
		});

		expect(result).toEqual({
			data: null,
			error: 'Invalid item',
			success: false,
		});
	});

	test('pix.create wraps the body in the { method, data } envelope the API expects', async () => {
		const fetchSpy = mock(async (url: string, init?: RequestInit) => {
			expect(url).toBe('https://api.abacatepay.com/v2/transparents/create');
			expect(JSON.parse(init?.body as string)).toEqual({
				method: 'PIX',
				data: { amount: 1000 },
			});

			return jsonResponse({
				data: { id: 'pix_char_123' },
				error: null,
				success: true,
			});
		});
		globalThis.fetch = fetchSpy as typeof fetch;

		const abacate = AbacatePay({ secret: 'sk_test' });
		await abacate.pix.create({ amount: 1000 });
	});
});

describe('AbacatePay (v1, deprecated)', () => {
	test('warns once when used', async () => {
		globalThis.fetch = mock(async () =>
			jsonResponse({ data: [], error: null, success: true }),
		) as typeof fetch;

		const warnings: unknown[] = [];
		console.warn = (...args: unknown[]) => {
			warnings.push(args.join(' '));
		};

		AbacatePayV1({ secret: 'sk_test' });

		expect(
			warnings.some((message) => `${message}`.includes('deprecated')),
		).toBe(true);
	});
});
