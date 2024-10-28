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
		.max(250, {
			message: "Description can't exceed 250 characters",
		})
		.optional(),
	code: z
		.string()
		.min(1, { message: "Program code can't be empty" })
		.max(20, {
			message: "Program code can't exceed 20 characters",
		})
		.optional(),
	duration: z.string().optional(),
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
			.max(250, {
				message: "Description can't exceed 250 characters",
			})
			.optional(),
	})
	.refine((data) => data.name || data.description, {
		message:
			'At least one field (name or description) must be provided',
	});

