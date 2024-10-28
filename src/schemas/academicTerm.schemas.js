import { z } from 'zod';
import { commonSchemaField } from './commonField.schema.js';


export const createAcademicTermSchema = z.object({
	name: commonSchemaField.nameField,
	description: commonSchemaField.descriptionField,
	duration: z.string().optional(),
});

export const updateAcademicTermSchema = z
	.object({
		name: commonSchemaField.nameField.optional(),
		description: commonSchemaField.descriptionField.optional(),
	})
	.refine((data) => data.name || data.description || data.duration, {
		message:
			'At least one field (name, description, duration) must be provided',
	});
