import { z } from 'zod';

export const createClassLevelSchema = z.object({
    name: z.enum(['level 100', 'level 200', 'level 300', 'level 400'], {
        message: 'Class level must be one of: level 100, level 200, level 300, level 400',
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
            .enum(['level 100', 'level 200', 'level 300', 'level 400'], {
                message: 'Class level must be one of: level 100, level 200, level 300, level 400',
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
        message: 'At least one field (name or description) must be provided',
    });