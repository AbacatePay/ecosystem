import { afterEach, describe, expect, mock, test } from 'bun:test';
import { createREST } from '../src';

const jsonResponse = (body: unknown, status = 200) =>
	new Response(JSON.stringify(body), {
		status,
		headers: { 'Content-Type': 'application/json' },
	});

const originalFetch = globalThis.fetch;

afterEach(() => {
	globalThis.fetch = originalFetch;
});

describe('createREST', () => {
	test('resolves with the exact success envelope the API returned', async () => {
		globalThis.fetch = mock(async () =>
			jsonResponse({ data: { id: 'cust_123' }, error: null, success: true }),
		) as typeof fetch;

		const client = createREST({ secret: 'sk_test' });
		const result = await client.get('/customers/get?id=cust_123');

		expect(result).toEqual({
			data: { id: 'cust_123' },
			error: null,
			success: true,
		});
	});

	test('normalizes a non-retryable API error into the APIResponse shape instead of throwing', async () => {
		globalThis.fetch = mock(async () =>
			jsonResponse(
				{ data: null, error: 'Customer not found', success: false },
				404,
			),
		) as typeof fetch;

		const client = createREST({ secret: 'sk_test' });
		const result = await client.get('/customers/get?id=missing');

		expect(result).toEqual({
			data: null,
			error: 'Customer not found',
			success: false,
		});
	});

	test('never throws when no secret can be resolved', async () => {
		const fetchSpy = mock(async () => jsonResponse({}));
		globalThis.fetch = fetchSpy as typeof fetch;

		const client = createREST({});
		const result = await client.get('/store/get');

		expect(result).toEqual({
			data: null,
			error: 'We could not find any AbacatePay secret, use REST({ secret })',
			success: false,
		});
		expect(fetchSpy).not.toHaveBeenCalled();
	});

	test('retries retryable statuses and eventually succeeds', async () => {
		let calls = 0;

		globalThis.fetch = mock(async () => {
			calls++;

			if (calls < 3)
				return jsonResponse(
					{ data: null, error: 'Unavailable', success: false },
					503,
				);

			return jsonResponse({ data: { ok: true }, error: null, success: true });
		}) as typeof fetch;

		const client = createREST({
			secret: 'sk_test',
			retry: { max: 5, backoff: () => 0 },
		});
		const result = await client.get('/store/get');

		expect(calls).toBe(3);
		expect(result).toEqual({ data: { ok: true }, error: null, success: true });
	});

	test('does not retry a non-retryable status', async () => {
		const fetchSpy = mock(async () =>
			jsonResponse({ data: null, error: 'Bad request', success: false }, 400),
		);
		globalThis.fetch = fetchSpy as typeof fetch;

		const client = createREST({
			secret: 'sk_test',
			retry: { max: 5, backoff: () => 0 },
		});
		await client.post('/checkouts/create', { body: {} });

		expect(fetchSpy).toHaveBeenCalledTimes(1);
	});

	test('gives up after exhausting retries without throwing', async () => {
		globalThis.fetch = mock(async () =>
			jsonResponse({ data: null, error: 'Unavailable', success: false }, 503),
		) as typeof fetch;

		const client = createREST({
			secret: 'sk_test',
			retry: { max: 2, backoff: () => 0 },
		});
		const result = await client.get('/store/get');

		expect(result).toEqual({
			data: null,
			error: '2 attempts were performed, all failed',
			success: false,
		});
	});
});
