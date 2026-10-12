import { afterEach, describe, expect, mock, test } from 'bun:test';
import {
	CheckoutStatus,
	CouponDiscountKind,
	CouponStatus,
	PaymentMethod,
	PixKeyType,
	ProductCycle,
	SubscriptionStatus,
	TransparentMethod,
	TransparentStatus,
	WebhookEventType,
} from '@abacatepay/types/v2';
import { AbacatePay } from '../src';
import { AbacatePay as AbacatePayV1 } from '../src/v1';

const jsonResponse = (body: unknown, status = 200) =>
	new Response(JSON.stringify(body), {
		status,
		headers: { 'Content-Type': 'application/json' },
	});

const originalFetch = globalThis.fetch;
const originalWarn = console.warn;

afterEach(() => {
	globalThis.fetch = originalFetch;
	console.warn = originalWarn;
});

const BASE = 'https://api.abacatepay.com/v2';

interface CapturedRequest {
	url: string;
	method: string;
	body: unknown;
}

/**
 * Replaces `fetch` with a mock that records every request and answers with a success envelope.
 */
const captureRequests = () => {
	const requests: CapturedRequest[] = [];

	globalThis.fetch = mock(async (url: string, init?: RequestInit) => {
		requests.push({
			url,
			method: init?.method ?? 'GET',
			body: init?.body ? JSON.parse(init.body as string) : undefined,
		});

		return jsonResponse({
			data: {},
			error: null,
			success: true,
			pagination: { hasMore: false, next: null, before: null },
		});
	}) as typeof fetch;

	return requests;
};

type Client = ReturnType<typeof AbacatePay>;

const customer = {
	name: 'Maria Silva',
	email: 'maria@exemplo.com',
	taxId: '529.982.247-25',
	cellphone: '(11) 99999-9999',
};

const cases: [
	name: string,
	call: (abacate: Client) => Promise<unknown>,
	expected: CapturedRequest,
][] = [
	[
		'customers.get(id)',
		(abacate) => abacate.customers.get('cust_123'),
		{
			url: `${BASE}/customers/get?id=cust_123`,
			method: 'GET',
			body: undefined,
		},
	],
	[
		'customers.get({ email }) URL-encodes the value',
		(abacate) => abacate.customers.get({ email: 'a+b@x.com' }),
		{
			url: `${BASE}/customers/get?email=a%2Bb%40x.com`,
			method: 'GET',
			body: undefined,
		},
	],
	[
		'customers.list() sends no query',
		(abacate) => abacate.customers.list(),
		{ url: `${BASE}/customers/list`, method: 'GET', body: undefined },
	],
	[
		'customers.list(query) sends the cursor and filters only',
		(abacate) =>
			abacate.customers.list({
				after: 'cust_9',
				limit: 50,
				startDate: '2026-01-01',
				endDate: undefined,
				email: 'maria',
			}),
		{
			url: `${BASE}/customers/list?after=cust_9&limit=50&startDate=2026-01-01&email=maria`,
			method: 'GET',
			body: undefined,
		},
	],
	[
		'customers.delete sends the id in the query string',
		(abacate) => abacate.customers.delete('cust_123'),
		{
			url: `${BASE}/customers/delete?id=cust_123`,
			method: 'POST',
			body: undefined,
		},
	],
	[
		'customers.create',
		(abacate) => abacate.customers.create({ email: 'maria@exemplo.com' }),
		{
			url: `${BASE}/customers/create`,
			method: 'POST',
			body: { email: 'maria@exemplo.com' },
		},
	],
	[
		'checkouts.create',
		(abacate) =>
			abacate.checkouts.create({
				items: [{ id: 'prod_1', quantity: 2 }],
				methods: [PaymentMethod.Pix, PaymentMethod.Card],
				card: { maxInstallments: 3 },
				metadata: { orderId: 42 },
			}),
		{
			url: `${BASE}/checkouts/create`,
			method: 'POST',
			body: {
				items: [{ id: 'prod_1', quantity: 2 }],
				methods: ['PIX', 'CARD'],
				card: { maxInstallments: 3 },
				metadata: { orderId: 42 },
			},
		},
	],
	[
		'checkouts.list(query)',
		(abacate) =>
			abacate.checkouts.list({ before: 'bill_1', status: CheckoutStatus.Paid }),
		{
			url: `${BASE}/checkouts/list?before=bill_1&status=PAID`,
			method: 'GET',
			body: undefined,
		},
	],
	[
		'checkouts.get(id)',
		(abacate) => abacate.checkouts.get('bill_1'),
		{ url: `${BASE}/checkouts/get?id=bill_1`, method: 'GET', body: undefined },
	],
	[
		'checkouts.get({ externalId, method })',
		(abacate) =>
			abacate.checkouts.get({
				externalId: 'order #1',
				method: PaymentMethod.Card,
			}),
		{
			url: `${BASE}/checkouts/get?externalId=order+%231&method=CARD`,
			method: 'GET',
			body: undefined,
		},
	],
	[
		'checkouts.delete',
		(abacate) => abacate.checkouts.delete('bill_1'),
		{
			url: `${BASE}/checkouts/delete?id=bill_1`,
			method: 'POST',
			body: undefined,
		},
	],
	[
		'checkouts.refund',
		(abacate) => abacate.checkouts.refund('bill_1', 'Pedido cancelado'),
		{
			url: `${BASE}/checkouts/refund`,
			method: 'POST',
			body: { id: 'bill_1', reason: 'Pedido cancelado' },
		},
	],
	[
		'paymentLinks.create',
		(abacate) =>
			abacate.paymentLinks.create({ items: [{ id: 'prod_1', quantity: 1 }] }),
		{
			url: `${BASE}/payment-links/create`,
			method: 'POST',
			body: { items: [{ id: 'prod_1', quantity: 1 }] },
		},
	],
	[
		'paymentLinks.list(query)',
		(abacate) => abacate.paymentLinks.list({ limit: 10 }),
		{
			url: `${BASE}/payment-links/list?limit=10`,
			method: 'GET',
			body: undefined,
		},
	],
	[
		'paymentLinks.get calls /payment-links/get',
		(abacate) => abacate.paymentLinks.get('bill_2'),
		{
			url: `${BASE}/payment-links/get?id=bill_2`,
			method: 'GET',
			body: undefined,
		},
	],
	[
		'paymentLinks.delete',
		(abacate) => abacate.paymentLinks.delete('bill_2'),
		{
			url: `${BASE}/payment-links/delete?id=bill_2`,
			method: 'POST',
			body: undefined,
		},
	],
	[
		'paymentLinks.refund without reason',
		(abacate) => abacate.paymentLinks.refund('char_1'),
		{
			url: `${BASE}/payment-links/refund`,
			method: 'POST',
			body: { id: 'char_1' },
		},
	],
	[
		'pix.create',
		(abacate) =>
			abacate.pix.create({
				amount: 1000,
				externalId: 'order-1',
				utm: { source: 'google' },
			}),
		{
			url: `${BASE}/transparents/create`,
			method: 'POST',
			body: {
				method: 'PIX',
				data: {
					amount: 1000,
					externalId: 'order-1',
					utm: { source: 'google' },
				},
			},
		},
	],
	[
		'pix.list (deprecated alias of transparents.list)',
		(abacate) => abacate.pix.list({ after: 'pix_char_1' }),
		{
			url: `${BASE}/transparents/list?after=pix_char_1`,
			method: 'GET',
			body: undefined,
		},
	],
	[
		'pix.simulate sends no body',
		(abacate) => abacate.pix.simulate('pix_char_1', { ignored: 'yes' }),
		{
			url: `${BASE}/transparents/simulate-payment?id=pix_char_1`,
			method: 'POST',
			body: undefined,
		},
	],
	[
		'pix.status',
		(abacate) => abacate.pix.status('pix_char_1'),
		{
			url: `${BASE}/transparents/check?id=pix_char_1`,
			method: 'GET',
			body: undefined,
		},
	],
	[
		'pix.refund',
		(abacate) => abacate.pix.refund('pix_char_1', 'Duplicado'),
		{
			url: `${BASE}/transparents/refund`,
			method: 'POST',
			body: { id: 'pix_char_1', reason: 'Duplicado' },
		},
	],
	[
		'boleto.create',
		(abacate) =>
			abacate.boleto.create({
				amount: 5000,
				customer: { name: 'Maria Silva', taxId: '52998224725' },
				dueDate: '2026-11-01',
			}),
		{
			url: `${BASE}/transparents/create`,
			method: 'POST',
			body: {
				method: 'BOLETO',
				data: {
					amount: 5000,
					customer: { name: 'Maria Silva', taxId: '52998224725' },
					dueDate: '2026-11-01',
				},
			},
		},
	],
	[
		'card.create with a ctok_ token',
		(abacate) =>
			abacate.card.create({
				amount: 3000,
				token: 'ctok_123',
				installmentCount: 3,
				customer,
				metadata: { orderId: 'ord_1' },
			}),
		{
			url: `${BASE}/transparents/create`,
			method: 'POST',
			body: {
				method: 'CARD',
				data: {
					amount: 3000,
					token: 'ctok_123',
					installmentCount: 3,
					customer,
					metadata: { orderId: 'ord_1' },
				},
			},
		},
	],
	[
		'card.create with a saved cardToken',
		(abacate) =>
			abacate.card.create({ amount: 1000, cardToken: 'card_tok_1', customer }),
		{
			url: `${BASE}/transparents/create`,
			method: 'POST',
			body: {
				method: 'CARD',
				data: { amount: 1000, cardToken: 'card_tok_1', customer },
			},
		},
	],
	[
		'transparents.get',
		(abacate) => abacate.transparents.get('card_1'),
		{
			url: `${BASE}/transparents/get?id=card_1`,
			method: 'GET',
			body: undefined,
		},
	],
	[
		'transparents.list with the method filter',
		(abacate) =>
			abacate.transparents.list({
				method: TransparentMethod.Card,
				status: TransparentStatus.Approved,
				after: 'card_9',
			}),
		{
			url: `${BASE}/transparents/list?method=CARD&status=APPROVED&after=card_9`,
			method: 'GET',
			body: undefined,
		},
	],
	[
		'transparents.refund',
		(abacate) => abacate.transparents.refund('card_1', 'Cliente desistiu'),
		{
			url: `${BASE}/transparents/refund`,
			method: 'POST',
			body: { id: 'card_1', reason: 'Cliente desistiu' },
		},
	],
	[
		'transfers.send',
		(abacate) =>
			abacate.transfers.send({
				amount: 1000,
				externalId: 'trx_1',
				pix: { key: 'foo@bar.com', type: PixKeyType.Email },
			}),
		{
			url: `${BASE}/pix/send`,
			method: 'POST',
			body: {
				amount: 1000,
				externalId: 'trx_1',
				pix: { key: 'foo@bar.com', type: 'EMAIL' },
			},
		},
	],
	[
		'transfers.get({ id })',
		(abacate) => abacate.transfers.get({ id: 'tran_1' }),
		{ url: `${BASE}/pix/get?id=tran_1`, method: 'GET', body: undefined },
	],
	[
		'transfers.get({ externalId }) sends the empty id the API requires',
		(abacate) => abacate.transfers.get({ externalId: 'trx 1' }),
		{
			url: `${BASE}/pix/get?id=&externalId=trx+1`,
			method: 'GET',
			body: undefined,
		},
	],
	[
		'transfers.list',
		(abacate) => abacate.transfers.list({ id: 'tran_' }),
		{ url: `${BASE}/pix/list?id=tran_`, method: 'GET', body: undefined },
	],
	[
		'coupons.create',
		(abacate) =>
			abacate.coupons.create({
				code: 'DEYVIN_20',
				discount: 2000,
				discountKind: CouponDiscountKind.Percentage,
				maxRedeems: -1,
			}),
		{
			url: `${BASE}/coupons/create`,
			method: 'POST',
			body: {
				code: 'DEYVIN_20',
				discount: 2000,
				discountKind: 'PERCENTAGE',
				maxRedeems: -1,
			},
		},
	],
	[
		'coupons.get URL-encodes the code',
		(abacate) => abacate.coupons.get('10%OFF', CouponStatus.Active),
		{
			url: `${BASE}/coupons/get?id=10%25OFF&status=ACTIVE`,
			method: 'GET',
			body: undefined,
		},
	],
	[
		'coupons.delete sends the id in the query string',
		(abacate) => abacate.coupons.delete('10%OFF'),
		{
			url: `${BASE}/coupons/delete?id=10%25OFF`,
			method: 'POST',
			body: undefined,
		},
	],
	[
		'coupons.list(query)',
		(abacate) => abacate.coupons.list({ status: CouponStatus.Disabled }),
		{
			url: `${BASE}/coupons/list?status=DISABLED`,
			method: 'GET',
			body: undefined,
		},
	],
	[
		'coupons.toggleStatus',
		(abacate) => abacate.coupons.toggleStatus('DEYVIN_20'),
		{
			url: `${BASE}/coupons/toggle`,
			method: 'POST',
			body: { id: 'DEYVIN_20' },
		},
	],
	[
		'stores.get',
		(abacate) => abacate.stores.get(),
		{ url: `${BASE}/stores/get`, method: 'GET', body: undefined },
	],
	[
		'store.get (deprecated) calls /stores/get',
		(abacate) => abacate.store.get(),
		{ url: `${BASE}/stores/get`, method: 'GET', body: undefined },
	],
	[
		'stores.list(query)',
		(abacate) => abacate.stores.list({ limit: 1 }),
		{ url: `${BASE}/stores/list?limit=1`, method: 'GET', body: undefined },
	],
	[
		'bankStatement.list(query)',
		(abacate) =>
			abacate.bankStatement.list({
				kind: 'WITHDRAW',
				method: 'PIX',
				search: 'tran_',
				after: 'tran_9',
			}),
		{
			url: `${BASE}/bank-statement/list?kind=WITHDRAW&method=PIX&search=tran_&after=tran_9`,
			method: 'GET',
			body: undefined,
		},
	],
	[
		'mrr.get',
		(abacate) => abacate.mrr.get(),
		{ url: `${BASE}/public-mrr/mrr`, method: 'GET', body: undefined },
	],
	[
		'mrr.merchant',
		(abacate) => abacate.mrr.merchant(),
		{
			url: `${BASE}/public-mrr/merchant-info`,
			method: 'GET',
			body: undefined,
		},
	],
	[
		'mrr.revenue',
		(abacate) =>
			abacate.mrr.revenue({ startDate: '2026-01-01', endDate: '2026-01-31' }),
		{
			url: `${BASE}/public-mrr/revenue?startDate=2026-01-01&endDate=2026-01-31`,
			method: 'GET',
			body: undefined,
		},
	],
	[
		'mrr.byDay',
		(abacate) =>
			abacate.mrr.byDay({ startDate: '2026-01-01', endDate: '2026-01-31' }),
		{
			url: `${BASE}/public-mrr/mrr-by-day?startDate=2026-01-01&endDate=2026-01-31`,
			method: 'GET',
			body: undefined,
		},
	],
	[
		'payouts.create sends the pix destination',
		(abacate) =>
			abacate.payouts.create({
				amount: 5000,
				pix: { type: PixKeyType.CNPJ, key: '12345678000199' },
			}),
		{
			url: `${BASE}/payouts/create`,
			method: 'POST',
			body: { amount: 5000, pix: { type: 'CNPJ', key: '12345678000199' } },
		},
	],
	[
		'payouts.get(id) looks up by id',
		(abacate) => abacate.payouts.get('tran_1'),
		{ url: `${BASE}/payouts/get?id=tran_1`, method: 'GET', body: undefined },
	],
	[
		'payouts.get({ externalId }) URL-encodes the value',
		(abacate) => abacate.payouts.get({ externalId: 'a&b' }),
		{
			url: `${BASE}/payouts/get?externalId=a%26b`,
			method: 'GET',
			body: undefined,
		},
	],
	[
		'payouts.list(query)',
		(abacate) => abacate.payouts.list({ after: 'tran_9', limit: 20 }),
		{
			url: `${BASE}/payouts/list?after=tran_9&limit=20`,
			method: 'GET',
			body: undefined,
		},
	],
	[
		'subscriptions.create',
		(abacate) =>
			abacate.subscriptions.create({
				items: [{ id: 'prod_1', quantity: 1 }],
				methods: [PaymentMethod.Card],
				retryPolicy: { maxRetry: 3, retryEvery: 2 },
			}),
		{
			url: `${BASE}/subscriptions/create`,
			method: 'POST',
			body: {
				items: [{ id: 'prod_1', quantity: 1 }],
				methods: ['CARD'],
				retryPolicy: { maxRetry: 3, retryEvery: 2 },
			},
		},
	],
	[
		'subscriptions.get',
		(abacate) => abacate.subscriptions.get({ customerId: 'cust_1' }),
		{
			url: `${BASE}/subscriptions/get?customerId=cust_1`,
			method: 'GET',
			body: undefined,
		},
	],
	[
		'subscriptions.list(query)',
		(abacate) =>
			abacate.subscriptions.list({
				status: SubscriptionStatus.Active,
				checkoutId: 'bill_1',
				after: 'subs_9',
			}),
		{
			url: `${BASE}/subscriptions/list?status=ACTIVE&checkoutId=bill_1&after=subs_9`,
			method: 'GET',
			body: undefined,
		},
	],
	[
		'subscriptions.cancel',
		(abacate) => abacate.subscriptions.cancel('subs_1'),
		{
			url: `${BASE}/subscriptions/cancel`,
			method: 'POST',
			body: { id: 'subs_1' },
		},
	],
	[
		'subscriptions.changePlan with items',
		(abacate) =>
			abacate.subscriptions.changePlan('subs_1', {
				items: [{ productId: 'prod_2', quantity: 2 }],
			}),
		{
			url: `${BASE}/subscriptions/change-plan`,
			method: 'POST',
			body: { id: 'subs_1', items: [{ productId: 'prod_2', quantity: 2 }] },
		},
	],
	[
		'subscriptions.changePlan with productId',
		(abacate) =>
			abacate.subscriptions.changePlan('subs_1', {
				productId: 'prod_2',
				quantity: 1,
			}),
		{
			url: `${BASE}/subscriptions/change-plan`,
			method: 'POST',
			body: { id: 'subs_1', productId: 'prod_2', quantity: 1 },
		},
	],
	[
		'subscriptions.recordUsage',
		(abacate) =>
			abacate.subscriptions.recordUsage('subs_1', {
				productId: 'prod_3',
				units: 5,
				action: 'add',
			}),
		{
			url: `${BASE}/subscriptions/record-usage`,
			method: 'POST',
			body: { id: 'subs_1', productId: 'prod_3', units: 5, action: 'add' },
		},
	],
	[
		'subscriptions.checkouts.get',
		(abacate) => abacate.subscriptions.checkouts.get('bill_1'),
		{
			url: `${BASE}/subscriptions/checkouts/get?id=bill_1`,
			method: 'GET',
			body: undefined,
		},
	],
	[
		'subscriptions.checkouts.list',
		(abacate) => abacate.subscriptions.checkouts.list({ keyword: 'maria' }),
		{
			url: `${BASE}/subscriptions/checkouts/list?keyword=maria`,
			method: 'GET',
			body: undefined,
		},
	],
	[
		'subscriptions.checkouts.delete sends the id in the query string',
		(abacate) => abacate.subscriptions.checkouts.delete('bill_1'),
		{
			url: `${BASE}/subscriptions/checkouts/delete?id=bill_1`,
			method: 'POST',
			body: undefined,
		},
	],
	[
		'products.create',
		(abacate) =>
			abacate.products.create({
				externalId: 'plano-pro',
				name: 'Plano Pro',
				price: 4990,
				currency: 'BRL',
				cycle: ProductCycle.Monthly,
			}),
		{
			url: `${BASE}/products/create`,
			method: 'POST',
			body: {
				externalId: 'plano-pro',
				name: 'Plano Pro',
				price: 4990,
				currency: 'BRL',
				cycle: 'MONTHLY',
			},
		},
	],
	[
		'products.get',
		(abacate) => abacate.products.get({ externalId: 'plano-pro' }),
		{
			url: `${BASE}/products/get?externalId=plano-pro`,
			method: 'GET',
			body: undefined,
		},
	],
	[
		'products.list(query)',
		(abacate) => abacate.products.list({ keyword: 'pro', limit: 5 }),
		{
			url: `${BASE}/products/list?keyword=pro&limit=5`,
			method: 'GET',
			body: undefined,
		},
	],
	[
		'products.delete',
		(abacate) => abacate.products.delete('prod_1'),
		{
			url: `${BASE}/products/delete?id=prod_1`,
			method: 'POST',
			body: undefined,
		},
	],
	[
		'webhooks.create',
		(abacate) =>
			abacate.webhooks.create({
				name: 'Pedidos',
				endpoint: 'https://example.com/hook',
				secret: 's'.repeat(32),
				events: [WebhookEventType.SubscriptionPlanChanged],
			}),
		{
			url: `${BASE}/webhooks/create`,
			method: 'POST',
			body: {
				name: 'Pedidos',
				endpoint: 'https://example.com/hook',
				secret: 's'.repeat(32),
				events: ['subscription.plan_changed'],
			},
		},
	],
	[
		'webhooks.list(query)',
		(abacate) => abacate.webhooks.list({ search: 'pedidos' }),
		{
			url: `${BASE}/webhooks/list?search=pedidos`,
			method: 'GET',
			body: undefined,
		},
	],
	[
		'webhooks.get',
		(abacate) => abacate.webhooks.get('webh_prod_1'),
		{
			url: `${BASE}/webhooks/get?id=webh_prod_1`,
			method: 'GET',
			body: undefined,
		},
	],
	[
		'webhooks.delete sends the id in the query string',
		(abacate) => abacate.webhooks.delete('webh_prod_1'),
		{
			url: `${BASE}/webhooks/delete?id=webh_prod_1`,
			method: 'POST',
			body: undefined,
		},
	],
	[
		'reports.list',
		(abacate) => abacate.reports.list(),
		{ url: `${BASE}/reports/list`, method: 'GET', body: undefined },
	],
	[
		'reports.run for a snapshot report',
		(abacate) => abacate.reports.run({ reportId: 'balance_now' }),
		{
			url: `${BASE}/reports/run?reportId=balance_now`,
			method: 'GET',
			body: undefined,
		},
	],
	[
		'reports.run for a period report',
		(abacate) =>
			abacate.reports.run({
				reportId: 'cash_flow',
				startDate: '2026-09-01',
				endDate: '2026-09-30',
				timezone: 'America/Sao_Paulo',
			}),
		{
			url: `${BASE}/reports/run?reportId=cash_flow&startDate=2026-09-01&endDate=2026-09-30&timezone=America%2FSao_Paulo`,
			method: 'GET',
			body: undefined,
		},
	],
];

describe('AbacatePay (v2) requests', () => {
	for (const [name, call, expected] of cases)
		test(name, async () => {
			const requests = captureRequests();

			await call(AbacatePay({ secret: 'sk_test' }));

			expect(requests).toEqual([expected]);
		});
});

describe('AbacatePay (v2)', () => {
	test('customers.get builds the right request and returns the response untouched', async () => {
		const fetchSpy = mock(async (url: string) => {
			expect(url).toBe(
				'https://api.abacatepay.com/v2/customers/get?id=cust_123',
			);

			return jsonResponse({
				data: { id: 'cust_123', email: 'foo@bar.com' },
				error: null,
				success: true,
			});
		});
		globalThis.fetch = fetchSpy as typeof fetch;

		const abacate = AbacatePay({ secret: 'sk_test' });
		const result = await abacate.customers.get('cust_123');

		expect(result).toEqual({
			data: { id: 'cust_123', email: 'foo@bar.com' },
			error: null,
			success: true,
		});
	});

	test('checkouts.create posts the body as-is and never throws on an API error', async () => {
		const fetchSpy = mock(async (url: string, init?: RequestInit) => {
			expect(url).toBe('https://api.abacatepay.com/v2/checkouts/create');
			expect(init?.method).toBe('POST');
			expect(JSON.parse(init?.body as string)).toEqual({
				items: [{ id: 'prod_123', quantity: 1 }],
			});

			return jsonResponse(
				{ data: null, error: 'Invalid item', success: false },
				400,
			);
		});
		globalThis.fetch = fetchSpy as typeof fetch;

		const abacate = AbacatePay({ secret: 'sk_test' });
		const result = await abacate.checkouts.create({
			items: [{ id: 'prod_123', quantity: 1 }],
		});

		expect(result).toEqual({
			data: null,
			error: 'Invalid item',
			success: false,
		});
	});

	test('list methods return the cursor pagination envelope untouched', async () => {
		const page = {
			data: [{ id: 'cust_2' }],
			error: null,
			success: true,
			pagination: { hasMore: true, next: 'cust_2', before: null },
		};
		globalThis.fetch = mock(async () => jsonResponse(page)) as typeof fetch;

		const abacate = AbacatePay({ secret: 'sk_test' });
		const result = await abacate.customers.list({ limit: 1 });

		expect(result).toEqual(page);
		if (result.success) expect(result.pagination.next).toBe('cust_2');
	});

	test('card.create is not retried when the API answers 503', async () => {
		const fetchSpy = mock(async () =>
			jsonResponse({ data: null, error: 'Unavailable', success: false }, 503),
		);
		globalThis.fetch = fetchSpy as typeof fetch;

		const abacate = AbacatePay({
			secret: 'sk_test',
			rest: { retry: { max: 3, backoff: () => 0 } },
		});
		const result = await abacate.card.create({
			amount: 1000,
			cardToken: 'card_tok_1',
			customer,
		});

		expect(fetchSpy).toHaveBeenCalledTimes(1);
		expect(result).toEqual({
			data: null,
			error: 'Unavailable',
			success: false,
		});
	});
});

describe('AbacatePay (v1, deprecated)', () => {
	test('warns once when used', async () => {
		globalThis.fetch = mock(async () =>
			jsonResponse({ data: [], error: null, success: true }),
		) as typeof fetch;

		const warnings: unknown[] = [];
		console.warn = (...args: unknown[]) => {
			warnings.push(args.join(' '));
		};

		AbacatePayV1({ secret: 'sk_test' });

		expect(
			warnings.some((message) => `${message}`.includes('deprecated')),
		).toBe(true);
	});
});
