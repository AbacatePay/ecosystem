import { z } from 'zod';
import { MissingTokenErrorSchema } from './errors';

const balanceSchema = z.object({
	available: z.number(),
	pending: z.number(),
	blocked: z.number(),
});

export const StoreSchema = z.object({
	id: z.string(),
	name: z.string().min(1, 'Store name is required'),
	balance: balanceSchema,
	error: MissingTokenErrorSchema.nullable(),
});
