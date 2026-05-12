import { describe, expect, mock, test } from 'bun:test';

const requests: Array<{
	method: string;
	route: string;
	options: unknown;
}> = [];

mock.module('@abacatepay/rest', () => ({
	REST: class {
		public constructor(public options: unknown) {}

		public post(route: string, options: unknown) {
			requests.push({ method: 'POST', route, options });
			return Promise.resolve({ route, options });
		}

		public get(route: string, options: unknown) {
			requests.push({ method: 'GET', route, options });
			return Promise.resolve({ route, options });
		}
	},
}));

const { AbacatePay } = await import('../src/v2');

describe('v2 transparent checkout SDK', () => {
	test('creates transparent checkout charges with the official body shape', async () => {
		requests.length = 0;

		const abacate = AbacatePay({ secret: 'abc_dev_test' });

		await abacate.transparents.create({
			method: 'BOLETO',
			data: {
				amount: 25_000,
				customer: {
					name: 'Mariana Costa',
					taxId: '987.654.321-00',
				},
			},
		});

		expect(requests).toEqual([
			{
				method: 'POST',
				route: '/transparents/create',
				options: {
					body: {
						method: 'BOLETO',
						data: {
							amount: 25_000,
							customer: {
								name: 'Mariana Costa',
								taxId: '987.654.321-00',
							},
						},
					},
				},
			},
		]);
	});

	test('keeps pix.create compatibility while sending the v2 transparent body', async () => {
		requests.length = 0;

		const abacate = AbacatePay({ secret: 'abc_dev_test' });

		await abacate.pix.create({
			amount: 10_000,
			description: 'Cobrança PIX no checkout transparente',
		});

		expect(requests).toEqual([
			{
				method: 'POST',
				route: '/transparents/create',
				options: {
					body: {
						method: 'PIX',
						data: {
							amount: 10_000,
							description: 'Cobrança PIX no checkout transparente',
						},
					},
				},
			},
		]);
	});

	test('lists transparent checkout charges with cursor filters', async () => {
		requests.length = 0;

		const abacate = AbacatePay({ secret: 'abc_dev_test' });

		await abacate.transparents.list({
			after: 'cursor-next',
			limit: 25,
			status: 'PAID',
		});

		expect(requests).toEqual([
			{
				method: 'GET',
				route: '/transparents/list?limit=25&after=cursor-next&status=PAID',
				options: undefined,
			},
		]);
	});
});
