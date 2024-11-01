import { z } from 'zod';

export const createSubjectSchema = z.object({
	name: z
		.string()
		.min(1, 'Subject name is required')
		.max(100, 'Subject name must be less than 100 characters'),
	description: z
		.string()
		.max(500, 'Description must be less than 500 characters')
		.optional(),
	academicTerm: z
		.string()
		.min(1, 'Academic term ID is required')
		.regex(
			/^[A-Za-z0-9-]+$/,
			'Academic term ID must be alphanumeric'
		),
	academicYear: z
		.string()
		.regex(
			/^\d{4}-\d{4}$/,
			'Academic year must be in the format YYYY-YYYY'
		)
		.optional(),
});

export const updateSubjectSchema = z
	.object({
		name: z
			.string()
			.min(1, 'Subject name is required')
			.max(100, 'Subject name must be less than 100 characters')
			.optional(),
		description: z
			.string()
			.max(500, 'Description must be less than 500 characters')
			.optional(),
		SendAcademicTerm: z.string().optional(),
		SendAcademicYear: z.string().optional(),
		sendProgram: z.string().optional(),
	})
	.refine(
		(data) =>
			data.name ||
			data.description ||
			data.SendAcademicTerm ||
			data.SendAcademicYear ||
			data.sendProgram,
		{
			message:
				'At least one field (name, description, SendAcademicTerm, SendAcademicYear, sendProgram) must be provided',
		}
	);
