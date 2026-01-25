interface AbacatePayElysiaErrorOptions {
	code: string;
}

export class AbacatePayElysiaError extends Error {
	/**
	 * The code of the error.
	 */
	readonly code: string;
	/**
	 * URL for the docs of [@abacatepay/elysia](https://www.npmjs.com/package/@abacatepay/elysia)
	 */
	static readonly docs = 'https://docs.abacatepay.com/pages/ecosystem/elysia';

	constructor(message: string, options: AbacatePayElysiaErrorOptions) {
		super(message);

		this.code = options.code;
		this.name = 'AbacatePayElysiaError';
	}
}
