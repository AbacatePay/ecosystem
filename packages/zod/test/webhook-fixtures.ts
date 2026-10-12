// Webhook bodies shaped exactly like the payloads AbacatePay sends (legacy delivery format).

const utms = {
	source: null,
	medium: null,
	campaign: null,
	term: null,
	content: null,
};

const noCustomer = { id: '', name: null, email: null, taxId: null };

const customer = {
	id: 'cust_1',
	name: 'Maria Silva',
	email: 'maria@exemplo.com',
	taxId: '529.***.247-**',
};

const checkout = {
	id: 'bill_1',
	externalId: null,
	url: 'https://app.abacatepay.com/pay/bill_1',
	amount: 1000,
	paidAmount: 1000,
	platformFee: 80,
	items: [{ id: 'prod_1', quantity: 1 }],
	status: 'PAID',
	methods: ['PIX', 'CARD'],
	frequency: 'ONE_TIME',
	coupons: [],
	devMode: false,
	customerId: 'cust_1',
	returnUrl: 'https://example.com/back',
	completionUrl: 'https://example.com/done',
	receiptUrl: null,
	metadata: { orderId: 'ord_1', attempt: 2, nested: { ok: true } },
	createdAt: '2026-10-01T12:00:00.000Z',
	updatedAt: '2026-10-01T12:05:00.000Z',
	trialDays: null,
	trialEndsAt: null,
	nextChargeAt: null,
	card: { maxInstallments: 1 },
	interest: {},
	fine: {},
	dueDate: null,
	upSellProductId: null,
	installmentsCount: null,
	payerInformation: null,
	utms: {},
};

export const checkoutCompleted = {
	id: 'log_1',
	event: 'checkout.completed',
	apiVersion: 2,
	devMode: false,
	data: {
		checkout,
		customer,
		payerInformation: {
			method: 'PIX',
			utms,
			PIX: {
				name: 'Maria Silva',
				taxId: '529.***.247-**',
				isSameAsCustomer: true,
			},
		},
	},
};

export const checkoutRefunded = {
	id: 'log_2',
	event: 'checkout.refunded',
	apiVersion: 2,
	devMode: false,
	data: {
		checkout: {
			...checkout,
			status: 'REFUNDED',
			interest: { value: 100 },
			fine: { value: 200, type: 'PERCENTAGE' },
			installmentsCount: 3,
			payerInformation: {
				name: 'Maria Silva',
				taxId: '529.***.247-**',
				bank: {
					ispb: '18236120',
					ispbName: 'NU PAGAMENTOS',
					account: '123456',
					accountDigit: '7',
					accountType: 'CHECKING',
					agency: '0001',
					pixAddressKey: null,
					pixKeyType: null,
				},
				card: null,
			},
			utms: { ...utms, source: 'google' },
		},
		customer,
		reason: 'Refund completed',
	},
};

export const transparentCardInstallments = {
	id: 'log_3',
	event: 'transparent.completed',
	apiVersion: 2,
	devMode: true,
	data: {
		transparent: {
			id: 'card_1',
			externalId: null,
			amount: 3000,
			paidAmount: null,
			platformFee: 134,
			status: 'APPROVED',
			items: [],
			methods: [],
			frequency: 'ONE_TIME',
			coupons: [],
			devMode: true,
			customerId: 'cust_1',
			createdAt: '2026-10-09T15:00:00.000Z',
			updatedAt: '2026-10-09T15:00:01.000Z',
			receiptUrl: null,
			metadata: { orderId: 'ord_42' },
			installmentCount: 2,
			installmentAmount: 1500,
			installmentNumber: 1,
			installmentGroupId: 'cinst_1',
		},
		customer,
		payerInformation: {
			method: 'CARD',
			utms,
			CARD: { number: '4242', brand: 'VISA' },
		},
	},
};

export const transparentPixDisputed = {
	id: 'log_4',
	event: 'transparent.disputed',
	apiVersion: 2,
	devMode: false,
	data: {
		transparent: {
			id: 'pix_char_1',
			externalId: 'ext_1',
			amount: 500,
			paidAmount: null,
			platformFee: 80,
			status: 'UNDER_DISPUTE',
			items: [],
			methods: [],
			frequency: 'ONE_TIME',
			coupons: [],
			devMode: false,
			customerId: null,
			createdAt: '2026-10-01T12:00:00.000Z',
			updatedAt: '2026-10-02T12:00:00.000Z',
			receiptUrl: null,
			metadata: {},
		},
		customer: noCustomer,
		payerInformation: {
			method: 'PIX',
			utms,
			PIX: { name: null, taxId: null, isSameAsCustomer: true },
		},
		reason: 'Dispute created',
	},
};

const subscription = {
	id: 'subs_1',
	amount: 2200,
	currency: 'BRL',
	method: 'CARD',
	status: 'ACTIVE',
	frequency: 'MONTHLY',
	createdAt: '2026-09-01T12:00:00.000Z',
	updatedAt: '2026-10-01T12:00:00.000Z',
	canceledAt: null,
	cancelPolicy: null,
	cancelledDueTo: null,
};

export const subscriptionCompleted = {
	id: 'log_5',
	event: 'subscription.completed',
	apiVersion: 2,
	devMode: false,
	data: {
		subscription,
		customer,
		checkout: {
			id: 'bill_2',
			externalId: 'plan-pro',
			url: 'https://app.abacatepay.com/pay/bill_2',
			amount: 2200,
			paidAmount: 2200,
			platformFee: 99,
			frequency: 'SUBSCRIPTION',
			items: [{ id: 'prod_2', quantity: 1 }],
			status: 'PAID',
			methods: ['CARD'],
			customerId: 'cust_1',
			receiptUrl: null,
			metadata: null,
			createdAt: '2026-09-01T11:00:00.000Z',
			updatedAt: '2026-09-01T12:00:00.000Z',
		},
		payment: {
			id: 'card_2',
			externalId: 'plan-pro',
			amount: 2200,
			paidAmount: 2200,
			platformFee: 99,
			status: 'APPROVED',
			methods: ['CARD'],
			receiptUrl: null,
			createdAt: '2026-09-01T12:00:00.000Z',
			updatedAt: '2026-09-01T12:00:00.000Z',
			metadata: {},
		},
		payerInformation: {
			method: 'CARD',
			utms,
			CARD: { number: '4242', brand: 'MASTERCARD' },
		},
	},
};

export const subscriptionPaymentFailed = {
	id: 'log_6',
	event: 'subscription.payment_failed',
	apiVersion: 2,
	devMode: true,
	data: {
		subscription,
		customer: noCustomer,
		installmentId: 'intl_1',
		installmentNumber: 2,
		retryNumber: 3,
	},
};

export const subscriptionPixAutomaticRejected = {
	...subscriptionPaymentFailed,
	id: 'log_7',
	data: {
		subscription: { ...subscription, method: 'PIX' },
		customer: noCustomer,
		installmentId: 'intl_2',
		installmentNumber: 4,
		rejectCode: 'AP13',
	},
};

export const subscriptionPlanChangeRequested = {
	id: 'log_8',
	event: 'subscription.plan_changed',
	apiVersion: 2,
	devMode: false,
	data: {
		subscription,
		customer,
		changeSource: 'API_CHANGE_PLAN',
		pendingUpdateId: 'subu_1',
		items: [{ productId: 'prod_3', quantity: 2, newAmount: 6000 }],
		productId: 'prod_3',
		quantity: 2,
		newAmount: 6000,
		status: 'PENDING',
		requestedAt: '2026-10-10T12:00:00.000Z',
	},
};

export const subscriptionPlanChangeApplied = {
	id: 'log_9',
	event: 'subscription.plan_changed',
	apiVersion: 2,
	devMode: false,
	data: { subscription: { ...subscription, amount: 6000 }, customer },
};

export const payoutCompleted = {
	id: 'log_10',
	event: 'payout.completed',
	apiVersion: 2,
	devMode: false,
	data: {
		withdraw: {
			id: 'tran_1',
			amount: 1000,
			status: 'COMPLETE',
			method: 'PIX',
			platformFee: 80,
			receiptUrl: null,
			externalId: null,
			createdAt: '2026-10-01T12:00:00.000Z',
			updatedAt: '2026-10-01T12:00:00.000Z',
			endToEndIdentifier: null,
		},
	},
};

export const payoutFailed = {
	...payoutCompleted,
	id: 'log_11',
	event: 'payout.failed',
	data: { withdraw: { ...payoutCompleted.data.withdraw, status: 'FAILED' } },
};

export const transferCompleted = {
	id: 'log_12',
	event: 'transfer.completed',
	apiVersion: 2,
	devMode: false,
	data: {
		transfer: {
			id: 'tran_2',
			externalId: 'payout-ext-123',
			amount: 1500,
			status: 'COMPLETE',
			method: 'PIX',
			platformFee: 80,
			receiptUrl: null,
			createdAt: '2026-10-01T12:00:00.000Z',
			updatedAt: '2026-10-01T12:00:00.000Z',
			endToEndIdentifier: null,
		},
	},
};

/**
 * Every legacy body above, keyed by a readable name.
 */
export const legacyBodies = {
	checkoutCompleted,
	checkoutRefunded,
	transparentCardInstallments,
	transparentPixDisputed,
	subscriptionCompleted,
	subscriptionPaymentFailed,
	subscriptionPixAutomaticRejected,
	subscriptionPlanChangeRequested,
	subscriptionPlanChangeApplied,
	payoutCompleted,
	payoutFailed,
	transferCompleted,
};

/**
 * A Standard Webhooks body: no `id`, the event name in `type` and a `timestamp`.
 */
export const standardTransparentCompleted = {
	type: 'transparent.completed',
	timestamp: '2026-11-02T12:00:00.000Z',
	apiVersion: 2,
	devMode: true,
	data: transparentCardInstallments.data,
};

/**
 * The `payout.completed` shape the previous SDK versions expected. AbacatePay never sends it.
 */
export const outdatedPayoutBody = {
	id: 'log_13',
	event: 'payout.completed',
	devMode: false,
	data: {
		transaction: {
			id: 'payout_1',
			devMode: false,
			receiptUrl: null,
			amount: 1000,
			platformFee: 80,
			externalId: 'trx_1',
			createdAt: '2026-10-01T12:00:00.000Z',
			updatedAt: '2026-10-01T12:00:00.000Z',
			status: 'COMPLETE',
		},
	},
};
