/**
 * Represents an API error returned by AbacatePay
 */
export class AbacatePayError extends Error {
	public constructor(public message: string) {
		super(message);

		this.name = 'AbacatePayError';
	}
}

/**
 * Represents a HTTP error (Timeout, Network etc)
 */
export class HTTPError extends Error {
	public constructor(
		/**
		 * Route that returned the error (e.g. `/store/get`)
		 */
		public route: string,
		/**
		 * The content of the error message
		 */
		public message: string,
	) {
		super(message);

		this.name = `AbacatePayError(${route})`;
	}
}
