import { z } from 'zod';
import { commonSchemaField } from './commonField.schema.js';

export const createAcademicYearSchema = z.object({
	name: commonSchemaField.nameField,
	fromYear: commonSchemaField.fromYearField,
	toYear: commonSchemaField.toYearField,
});

export const updateAcademicYearSchema = z
	.object({
		name: commonSchemaField.nameField.optional(),
		fromYear: commonSchemaField.fromYearField.optional(),
		toYear: commonSchemaField.toYearField.optional(),
	})
	.refine((data) => data.name || data.fromYear || data.toYear, {
		message:
			'At least one field (name, fromYear, toYear) must be provided',
	});
