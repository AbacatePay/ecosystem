export const sleep = (ms: number) =>
	new Promise((resolve) => setTimeout(resolve, ms));

export const RETRYABLE_STATUS = [408, 425, 429, 500, 502, 503, 504];

export const BASE_DELAY_MS = 300;
export const MAX_DELAY_MS = 10_000;

export const backoff = (attempt: number) => {
	const exp = Math.min(MAX_DELAY_MS, BASE_DELAY_MS * 2 ** attempt);
	const jitter = Math.random() * exp * 0.3;

	return Math.floor(exp + jitter);
}
