import type {
	InternalHandleErrorOptions,
	InternalHandleTimeoutErrorOptions,
	MakeRequestOptions,
	MakeRequestOptionsWithoutMethod,
	RESTOptions,
} from './types';
import {
	backoff,
	isRetrySafeMethod,
	isTimeoutError,
	RATE_LIMIT_STATUS_CODE,
	RETRYABLE_STATUS,
	sleep,
} from './utils';

const DEFAULT_TIMEOUT_IN_MS = 30_000;
const NO_CONTENT_STATUS_CODE = 204;

/**
 * Builds an `APIResponse`-shaped failure so client-side issues (network
 * errors, timeouts, missing credentials) are indistinguishable from a real
 * API error to callers — nothing in this client ever throws.
 */
const asFailure = <R>(error: string): R =>
	({ data: null, error, success: false }) as R;

/**
 * Creates a REST client for the AbacatePay API.
 *
 * Every method resolves — it never rejects or throws. Client-side failures
 * (network errors, timeouts, missing secret) are normalized into the same
 * `{ data, error, success }` shape a real API response has.
 *
 * Retries: GET and HEAD requests are retried on timeouts and on retryable
 * statuses (408, 425, 429, 5xx). Any other method (POST, PUT, PATCH, DELETE)
 * is only retried on 429, which the API returns before running the request:
 * retrying a request that may already have been processed could charge or
 * send money twice.
 */
export const createREST = (options: RESTOptions = {}) => {
	const makeURL = (route: string, query?: MakeRequestOptions['query']) => {
		const base = `${options.base ?? 'https://api.abacatepay.com/v'}${options.version ?? 2}${route}`;
		const search = query ? `${new URLSearchParams(query)}` : '';

		if (!search) return base;

		return `${base}${base.includes('?') ? '&' : '?'}${search}`;
	};

	const makeHeaders = (custom?: Record<string, string>) => {
		const {
			secret = process.env.ABACATEPAY_SECRET ?? process.env.ABACATEPAY_API_KEY,
		} = options;

		if (!secret) return null;

		return {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${secret}`,
			...options.headers,
			...custom,
		};
	};

	const parseResponse = async <R>(response: Response): Promise<R> => {
		if (response.status === NO_CONTENT_STATUS_CODE)
			return { data: null, error: null, success: true } as R;

		return (await response.json()) as R;
	};

	const handleTimeout = async <R>({
		retry,
		route,
		attempt,
		timeout,
		requestOptions,
	}: InternalHandleTimeoutErrorOptions): Promise<R> => {
		const { method } = requestOptions;

		if (!isRetrySafeMethod(method))
			return asFailure<R>(
				`${method} ${route} timed out after ${timeout}ms and was not retried: it may still have been processed by AbacatePay, so check its status before trying again`,
			);

		if (attempt >= retry.max)
			return asFailure<R>(`${retry.max} attempts were performed, all failed`);

		if (retry.onRetry)
			await retry.onRetry({ attempt, options: requestOptions });

		const delay = (retry.backoff ?? backoff)(attempt);

		await sleep(delay);

		return makeRequest<R>(route, requestOptions, attempt + 1);
	};

	const handleError = async <R>({
		route,
		retry,
		requestOptions,
		attempt,
		response,
	}: InternalHandleErrorOptions): Promise<R> => {
		const isRetryable =
			RETRYABLE_STATUS.includes(response.status) &&
			(isRetrySafeMethod(requestOptions.method) ||
				response.status === RATE_LIMIT_STATUS_CODE);

		if (!isRetryable) {
			const body = await response.json().catch(() => null);

			return asFailure<R>(
				body?.error ??
					`Request to ${route} failed with status ${response.status}`,
			);
		}

		const { onRateLimit } = options;

		if (attempt >= retry.max)
			return asFailure<R>(`${retry.max} attempts were performed, all failed`);

		if (retry.onRetry)
			await retry.onRetry({ attempt, options: requestOptions, response });
		if (response.status === RATE_LIMIT_STATUS_CODE && onRateLimit)
			await onRateLimit(response);

		const delay = (retry.backoff ?? backoff)(attempt);

		await sleep(delay);

		return makeRequest<R>(route, requestOptions, attempt + 1);
	};

	const makeRequest = async <R>(
		route: string,
		requestOptions: MakeRequestOptions,
		attempt = 0,
	): Promise<R> => {
		const headers = makeHeaders(requestOptions.headers);

		if (!headers)
			return asFailure<R>(
				'We could not find any AbacatePay secret, use REST({ secret })',
			);

		const url = makeURL(route, requestOptions.query);
		const timeout =
			requestOptions.timeout ?? options.timeout ?? DEFAULT_TIMEOUT_IN_MS;
		const retry = requestOptions.retry ?? options.retry ?? { max: 3 };

		try {
			const response = await fetch(url, {
				method: requestOptions.method,
				signal: AbortSignal.timeout(timeout),
				headers,
				body:
					'body' in requestOptions ? JSON.stringify(requestOptions.body) : null,
			});

			if (!response.ok)
				return handleError<R>({
					route,
					retry,
					attempt,
					requestOptions,
					response,
				});

			return parseResponse<R>(response);
		} catch (err) {
			if (isTimeoutError(err))
				return handleTimeout<R>({
					retry,
					route,
					attempt,
					timeout,
					requestOptions,
				});

			return asFailure<R>(`${err}`);
		}
	};

	const client = {
		/**
		 * Options used in all requests. Mutating this object (e.g. via
		 * `setSecret`) affects every subsequent call made with this client.
		 */
		options,

		/**
		 * Sets the authorization token that should be used for requests.
		 * @param secret The secret to use.
		 */
		setSecret(secret: string) {
			options.secret = secret;

			return client;
		},

		/**
		 * Runs a GET request from the API. Retried on timeouts and retryable statuses.
		 */
		get<R>(route: string, requestOptions?: MakeRequestOptionsWithoutMethod) {
			return makeRequest<R>(route, { ...requestOptions, method: 'GET' });
		},

		/**
		 * Runs a POST request from the API. Only retried on 429 (Never on timeouts or 5xx).
		 */
		post<R>(route: string, requestOptions?: MakeRequestOptionsWithoutMethod) {
			return makeRequest<R>(route, { ...requestOptions, method: 'POST' });
		},

		/**
		 * Runs a DELETE request from the API. Only retried on 429 (Never on timeouts or 5xx).
		 */
		delete<R>(route: string, requestOptions?: MakeRequestOptionsWithoutMethod) {
			return makeRequest<R>(route, { ...requestOptions, method: 'DELETE' });
		},

		/**
		 * Runs a PUT request from the API. Only retried on 429 (Never on timeouts or 5xx).
		 */
		put<R>(route: string, requestOptions?: MakeRequestOptionsWithoutMethod) {
			return makeRequest<R>(route, { ...requestOptions, method: 'PUT' });
		},

		/**
		 * Runs a PATCH request from the API. Only retried on 429 (Never on timeouts or 5xx).
		 */
		patch<R>(route: string, requestOptions?: MakeRequestOptionsWithoutMethod) {
			return makeRequest<R>(route, { ...requestOptions, method: 'PATCH' });
		},
	};

	return client;
};

/**
 * A REST client for the AbacatePay API, as returned by {@link createREST}.
 */
export type REST = ReturnType<typeof createREST>;
