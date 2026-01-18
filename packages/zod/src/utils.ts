import { z } from 'zod';

export const StringEnum = <V extends string>(
	values: readonly [V, ...V[]],
	description: string,
) => z.enum(values).describe(description);
