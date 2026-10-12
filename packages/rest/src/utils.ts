/**
 * Function to wait for the `ms`.
 */
export const sleep = (ms: number) =>
	new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Status code of rate limit responses.
 */
export const RATE_LIMIT_STATUS_CODE = 429;

export const SERVICE_UNAVAILABLE_STATUS_CODE = 503;

/**
 * Methods that are retried on timeouts and on every retryable status. Any
 * other method is only retried on 429, because the request may already have
 * been processed by the API.
 */
export const RETRY_SAFE_METHODS = ['GET', 'HEAD'];

/**
 * Whether a request with this method can be retried after it may have reached the API.
 */
export const isRetrySafeMethod = (method: string) =>
	RETRY_SAFE_METHODS.includes(method.toUpperCase());

/**
 * Array of any retryable status code. Only `GET`/`HEAD` requests are retried
 * on all of them; other methods are only retried on 429.
 */
export const RETRYABLE_STATUS = [
	408,
	425,
	RATE_LIMIT_STATUS_CODE,
	500,
	502,
	SERVICE_UNAVAILABLE_STATUS_CODE,
	504,
];

const BASE_DELAY_MS = 300;
const MAX_DELAY_MS = 10_000;

/**
 * Function that use exponential backoff with jitter based on attempt.
 */
export const backoff = (attempt: number) => {
	const exp = Math.min(MAX_DELAY_MS, BASE_DELAY_MS * 2 ** attempt);
	const jitter = Math.random() * exp * 0.3;

	return Math.floor(exp + jitter);
};

export const isTimeoutError = (err: unknown) =>
	(err as { name?: string })?.name === 'TimeoutError';
