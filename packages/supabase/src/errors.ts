interface AbacatePaySupabaseErrorOptions {
	code: string;
}

export class AbacatePaySupabaseError extends Error {
	/**
	 * The code of the error.
	 */
	readonly code: string;
	/**
	 * URL for the docs of [@abacatepay/supabase](https://www.npmjs.com/package/@abacatepay/supabase)
	 */
	static readonly docs = 'https://docs.abacatepay.com/pages/ecosystem/supabase';

	constructor(message: string, options: AbacatePaySupabaseErrorOptions) {
		super(message);

		this.code = options.code;
		this.name = 'AbacatePaySupabaseError';
	}
}
