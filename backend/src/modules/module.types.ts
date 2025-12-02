import { z } from 'zod';

export type Action<TConfig = any, TResult = any> = {
	id: string;
	category: string;
	configSchema: z.ZodSchema<TConfig>;
	resultSchema: z.ZodSchema<TResult>;
	execute: (config: TConfig) => Promise<TResult>;
	validate?: (config: TConfig) => { valid: boolean; errors?: string[] };
};
