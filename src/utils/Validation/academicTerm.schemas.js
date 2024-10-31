import { z } from 'zod';
import { commonSchemaField } from './commonField.schema.js';

const durationField = z
    .string()
    .regex(/^\d+ (days|weeks|months|years)$/, {
        message: 'Duration must be a valid format (e.g., "10 days", "3 weeks")',
    })
    .optional();

export const createAcademicTermSchema = z.object({
    name: z.enum(['1st sem', '2nd sem', '3rd sem', '4th sem', '5th sem', '6th sem', '7th sem', '8th sem'], {
        message: 'Invalid academic term name (1st sem, 2nd sem, 3rd sem, 4th sem, 5th sem, 6th sem, 7th sem, 8th sem)'
    }),
    description: commonSchemaField.descriptionField,
    duration: durationField,
});

export const updateAcademicTermSchema = z
    .object({
        name: z.enum(['1st sem', '2nd sem', '3rd sem', '4th sem', '5th sem', '6th sem', '7th sem', '8th sem'], {
            message: 'Invalid academic term name (1st sem, 2nd sem, 3rd sem, 4th sem, 5th sem, 6th sem, 7th sem, 8th sem)'
        }),
        description: commonSchemaField.descriptionField.optional(),
        duration: durationField.optional(),
    })
    .refine((data) => data.name || data.description || data.duration, {
        message: 'At least one field (name, description, duration) must be provided',
    });