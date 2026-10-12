/**
 * Status of a transaction (payouts, PIX transfers, refunds and bank statement entries).
 *
 * https://docs.abacatepay.com/pages/payouts/reference#atributos
 */
export enum TransactionStatus {
	Pending = 'PENDING',
	Approved = 'APPROVED',
	Expired = 'EXPIRED',
	Cancelled = 'CANCELLED',
	Complete = 'COMPLETE',
	Refunded = 'REFUNDED',
	Redeemed = 'REDEEMED',
	UnderDispute = 'UNDER_DISPUTE',
	Failed = 'FAILED',
}

/**
 * Method of a transaction.
 */
export type TransactionMethod =
	| 'PIX'
	| 'CARD'
	| 'PIX_QRCODE'
	| 'BOLETO'
	| 'INTERNAL'
	| 'TED';

/**
 * Kind of a transaction.
 */
export type TransactionKind =
	| 'DEPOSIT'
	| 'CARD_APPROVED'
	| 'BOLETO_APPROVED'
	| 'UNDO_CARD_APPROVED'
	| 'UNDO_DEPOSIT'
	| 'WITHDRAW'
	| 'UNDO_WITHDRAW'
	| 'REFUND'
	| 'UNDO_REFUND'
	| 'INTERNAL_TRANSFER'
	| 'UNDO_INTERNAL_TRANSFER'
	| 'SPLIT'
	| 'UNDO_SPLIT'
	| 'SWAP_INTERNAL'
	| 'UNDO_SWAP_INTERNAL'
	| 'SWAP_INTERNAL_TO_BRAZIL'
	| 'UNDO_SWAP_INTERNAL_TO_BRAZIL'
	| 'SWAP_INTERNAL_CREDIT_CARD_RECEIVED'
	| 'SWAP_INTERNAL_BOLETO_SETTLED'
	| 'PLUGIN_FEE'
	| 'ANTICIPATION_REQUESTED'
	| 'UNDO_ANTICIPATION_REQUESTED'
	| 'ANTICIPATION_CREDITED'
	| 'UNDO_ANTICIPATION_CREDITED'
	| 'UNDO_DEPOSIT_FEE'
	| 'JUDICIAL_BLOCK'
	| 'UNDO_JUDICIAL_BLOCK'
	| 'JUDICIAL_TRANSFER'
	| 'VALUE_BLOCKED'
	| 'VALUE_UNBLOCKED'
	| 'DISPUTE_FEE_CHARGE'
	| 'UNDO_DISPUTE_FEE_CHARGE'
	| 'DISPUTE_REVENUE_LOCK'
	| 'UNDO_DISPUTE_REVENUE_LOCK'
	| 'DISPUTE_DEBT_RECOVERY'
	| 'WOOVI_PIX_IN_FEE'
	| 'WOOVI_PIX_IN_FEE_REIMBURSED';
