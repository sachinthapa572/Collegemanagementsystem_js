import { z } from 'zod';

// Schema for creating a new Program
export const createProgramSchema = z.object({
	name: z
		.string()
		.min(1, { message: "Program name can't be empty" })
		.max(100, {
			message: "Program name can't exceed 100 characters",
		}),
	description: z
		.string()
		.max(1000, {
			message: "Description can't exceed 1000 characters",
		})
		.optional(),
	code: z
		.string()
		.min(1, { message: "Program code can't be empty" })
		.max(20, {
			message: "Program code can't exceed 20 characters",
		})
		.optional(),
	duration: z
		.string()
		.regex(/^\d+ (days|weeks|months|years)$/, {
			message: 'Duration must be a valid format (e.g., "10 days", "3 weeks")',
		})
		.optional(),
});

// Schema for updating a Program
export const updateProgramSchema = z
	.object({
		name: z
			.string()
			.min(1, { message: "Program name can't be empty" })
			.max(100, {
				message: "Program name can't exceed 100 characters",
			})
			.optional(),
		description: z
			.string()
			.max(1000, {
				message: "Description can't exceed 1000 characters",
			})
			.optional(),
		code: z
			.string()
			.min(1, { message: "Program code can't be empty" })
			.max(20, {
				message: "Program code can't exceed 20 characters",
			})
			.optional(),
		duration: z
			.string()
			.regex(/^\d+ (days|weeks|months|years)$/, {
				message: 'Duration must be a valid format (e.g., "10 days", "3 weeks")',
			})
			.optional(),
	})
	.refine((data) => data.name || data.description || data.code || data.duration, {
		message: 'At least one field (name, description, code, or duration) must be provided',
	});