import { afterEach, describe, expect, mock, test } from 'bun:test';
import { createREST } from '../src';

const jsonResponse = (body: unknown, status = 200) =>
	new Response(JSON.stringify(body), {
		status,
		headers: { 'Content-Type': 'application/json' },
	});

const timeoutError = () =>
	new DOMException('The operation timed out.', 'TimeoutError');

/**
 * A fetch that never answers, so only the abort signal can end the request.
 */
const hangingFetch = () =>
	mock(
		(_url: string, init?: RequestInit) =>
			new Promise<Response>((_, reject) => {
				init?.signal?.addEventListener('abort', () =>
					reject(init.signal?.reason),
				);
			}),
	);

const originalFetch = globalThis.fetch;
const originalTimeout = AbortSignal.timeout;

afterEach(() => {
	globalThis.fetch = originalFetch;
	AbortSignal.timeout = originalTimeout;
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
		const result = await client.get('/stores/get');

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
		const result = await client.get('/stores/get');

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
		const result = await client.get('/stores/get');

		expect(result).toEqual({
			data: null,
			error: '2 attempts were performed, all failed',
			success: false,
		});
	});

	test('appends the query option to a route that already has a query string', async () => {
		const fetchSpy = mock(async (url: string) => {
			expect(url).toBe(
				'https://api.abacatepay.com/v2/transparents/simulate-payment?id=pix_char_1&foo=bar',
			);

			return jsonResponse({ data: {}, error: null, success: true });
		});
		globalThis.fetch = fetchSpy as typeof fetch;

		const client = createREST({ secret: 'sk_test' });
		await client.post('/transparents/simulate-payment?id=pix_char_1', {
			query: { foo: 'bar' },
		});

		expect(fetchSpy).toHaveBeenCalledTimes(1);
	});
});

describe('retry policy of requests that are not idempotent', () => {
	test('a POST is not retried on a 5xx and returns the API error', async () => {
		const fetchSpy = mock(async () =>
			jsonResponse({ data: null, error: 'Unavailable', success: false }, 503),
		);
		globalThis.fetch = fetchSpy as typeof fetch;

		const client = createREST({
			secret: 'sk_test',
			retry: { max: 5, backoff: () => 0 },
		});
		const result = await client.post('/transparents/create', { body: {} });

		expect(fetchSpy).toHaveBeenCalledTimes(1);
		expect(result).toEqual({
			data: null,
			error: 'Unavailable',
			success: false,
		});
	});

	test('a POST that times out is not retried and says it may have been processed', async () => {
		const fetchSpy = mock(async () => {
			throw timeoutError();
		});
		globalThis.fetch = fetchSpy as typeof fetch;

		const client = createREST({
			secret: 'sk_test',
			retry: { max: 5, backoff: () => 0 },
		});
		const result = await client.post<{
			data: null;
			error: string;
			success: false;
		}>('/payouts/create', { body: { amount: 1000 } });

		expect(fetchSpy).toHaveBeenCalledTimes(1);
		expect(result.success).toBe(false);
		expect(result.data).toBeNull();
		expect(result.error).toContain('POST /payouts/create timed out');
		expect(result.error).toContain('may still have been processed');
		expect(result.error).not.toContain('attempts were performed');
	});

	test('PUT, PATCH and DELETE are not retried on a 5xx either', async () => {
		const fetchSpy = mock(async () =>
			jsonResponse({ data: null, error: 'Bad gateway', success: false }, 502),
		);
		globalThis.fetch = fetchSpy as typeof fetch;

		const client = createREST({
			secret: 'sk_test',
			retry: { max: 5, backoff: () => 0 },
		});

		await client.put('/resource');
		await client.patch('/resource');
		await client.delete('/resource');

		expect(fetchSpy).toHaveBeenCalledTimes(3);
	});

	test('a POST is retried on 429, which the API returns before running the request', async () => {
		let calls = 0;
		const onRateLimit = mock(() => undefined);

		globalThis.fetch = mock(async () => {
			calls++;

			if (calls < 3)
				return jsonResponse(
					{ data: null, error: 'Too many requests', success: false },
					429,
				);

			return jsonResponse({
				data: { id: 'card_1' },
				error: null,
				success: true,
			});
		}) as typeof fetch;

		const client = createREST({
			secret: 'sk_test',
			retry: { max: 5, backoff: () => 0 },
			onRateLimit,
		});
		const result = await client.post('/transparents/create', { body: {} });

		expect(calls).toBe(3);
		expect(onRateLimit).toHaveBeenCalledTimes(2);
		expect(result).toEqual({
			data: { id: 'card_1' },
			error: null,
			success: true,
		});
	});

	test('a GET is still retried after a timeout', async () => {
		let calls = 0;

		globalThis.fetch = mock(async () => {
			calls++;

			if (calls < 2) throw timeoutError();

			return jsonResponse({ data: [], error: null, success: true });
		}) as typeof fetch;

		const client = createREST({
			secret: 'sk_test',
			retry: { max: 3, backoff: () => 0 },
		});
		const result = await client.get('/customers/list');

		expect(calls).toBe(2);
		expect(result).toEqual({ data: [], error: null, success: true });
	});
});

describe('timeouts', () => {
	test('uses 30 seconds by default', async () => {
		const timeouts: number[] = [];

		AbortSignal.timeout = (ms: number) => {
			timeouts.push(ms);

			return new AbortController().signal;
		};
		globalThis.fetch = mock(async () =>
			jsonResponse({ data: {}, error: null, success: true }),
		) as typeof fetch;

		await createREST({ secret: 'sk_test' }).get('/stores/get');

		expect(timeouts).toEqual([30_000]);
	});

	test('a per-request timeout overrides the client timeout', async () => {
		const fetchSpy = hangingFetch();
		globalThis.fetch = fetchSpy as unknown as typeof fetch;

		const client = createREST({ secret: 'sk_test', timeout: 60_000 });
		const startedAt = Date.now();
		const result = await client.post<{
			data: null;
			error: string;
			success: false;
		}>('/pix/send', { body: {}, timeout: 25 });

		expect(Date.now() - startedAt).toBeLessThan(5_000);
		expect(fetchSpy).toHaveBeenCalledTimes(1);
		expect(result.error).toContain('timed out after 25ms');
	});
});
