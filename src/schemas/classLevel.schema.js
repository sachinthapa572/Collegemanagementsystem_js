import { z } from 'zod';

export const createClassLevelSchema = z.object({
	name: z
		.string()
		.min(1, { message: "Class level name can't be empty" })
		.max(50, {
			message: "Class level name can't exceed 50 characters",
		}),
	description: z
		.string()
		.max(200, {
			message: "Description can't exceed 200 characters",
		})
		.optional(),
});

// Schema for updating a class level
export const updateClassLevelSchema = z
	.object({
		name: z
			.string()
			.min(1, { message: "Class level name can't be empty" })
			.max(50, {
				message: "Class level name can't exceed 50 characters",
			})
			.optional(),
		description: z
			.string()
			.max(200, {
				message: "Description can't exceed 200 characters",
			})
			.optional(),
	})
	.refine((data) => data.name || data.description, {
		message:
			'At least one field (name or description) must be provided',
	});
