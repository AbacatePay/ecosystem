import type { TransactionStatus } from './transaction';

/**
 * A sub account (`sacc_...`): a balance kept inside your store for one seller, identified by
 * the seller's CPF or CNPJ. It receives parts of your PIX charges (`splits`) and withdraws to
 * the seller's own CPF/CNPJ PIX key.
 *
 * https://docs.abacatepay.com/pages/sub-accounts/reference
 */
export interface APISubAccount {
	/**
	 * Unique sub account identifier (`sacc_...`).
	 */
	id: string;
	/**
	 * Name of the seller.
	 */
	name: string;
	/**
	 * CPF or CNPJ of the seller, digits only.
	 */
	taxId: string;
	/**
	 * Your identifier for this sub account.
	 */
	externalId: string | null;
	/**
	 * Current balance of the sub account. It is not part of your store balance.
	 */
	balance: APISubAccountBalance;
	/**
	 * Indicates whether the sub account was created in a testing environment.
	 */
	devMode: boolean;
	/**
	 * Metadata sent on creation.
	 */
	metadata: Record<string, string>;
	/**
	 * Sub account creation date.
	 */
	createdAt: string;
	/**
	 * Sub account update date.
	 */
	updatedAt: string;
}

/**
 * Balance of a sub account, in cents.
 */
export interface APISubAccountBalance {
	/**
	 * Available for withdrawal, in cents.
	 */
	available: number;
	/**
	 * Held, in cents.
	 */
	blocked: number;
}

/**
 * A PIX withdrawal from a sub account to the seller's CPF/CNPJ PIX key.
 *
 * https://docs.abacatepay.com/pages/sub-accounts/withdraw
 */
export interface APISubAccountWithdraw {
	/**
	 * Unique transaction identifier (`tran_...`).
	 */
	id: string;
	/**
	 * Sub account the withdrawal came from (`sacc_...`).
	 */
	subAccountId: string;
	/**
	 * Withdrawal status.
	 *
	 * @see {@link TransactionStatus}
	 */
	status: TransactionStatus;
	/**
	 * Indicates whether the withdrawal was created in a testing environment.
	 */
	devMode: boolean;
	/**
	 * Receipt URL.
	 */
	receiptUrl: string;
	/**
	 * Withdrawal amount in cents.
	 */
	amount: number;
	/**
	 * Fee in cents.
	 */
	platformFee: number;
	/**
	 * Your identifier for this withdrawal.
	 */
	externalId: string;
	/**
	 * Withdrawal creation date.
	 */
	createdAt: string;
	/**
	 * Withdrawal update date.
	 */
	updatedAt: string;
}
