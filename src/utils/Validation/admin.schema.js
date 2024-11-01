import { z } from 'zod';
import { commonSchemaField } from './commonField.schema.js';

export const registerAdminSchema = z.object({
	username: commonSchemaField.usernameField,
	email: commonSchemaField.emailField,
	password: commonSchemaField.passwordField,
	role: commonSchemaField.roleField.optional(),
});

export const loginAdminSchema = z.object({
	email: commonSchemaField.emailField,
	password: commonSchemaField.passwordField,
});

export const updateAdminSchema = z
	.object({
		username: commonSchemaField.usernameField.optional(),
		email: commonSchemaField.emailField.optional(),
		oldPassword: commonSchemaField.passwordField.optional(),
		newPassword: commonSchemaField.passwordField.optional(),
	})
	.refine(
		(data) =>
			(!data.oldPassword && !data.newPassword) ||
			(data.oldPassword && data.newPassword),
		{
			message:
				'Both old and new passwords must be provided together',
			path: ['oldPassword', 'newPassword'],
		}
	)
	.refine(
		(data) =>
			data.username ||
			data.email ||
			data.oldPassword ||
			data.newPassword,
		{
			message:
				'At least one field (username, email, oldPassword, newPassword) must be provided',
		}
	);
export const updateAdminSchemaByAdmin = z
	.object({
		username: commonSchemaField.usernameField.optional(),
		email: commonSchemaField.emailField.optional(),
	})
	.refine((data) => data.username || data.email, {
		message:
			'At least one field (username, email) must be provided',
	});

export const singleAdminSchema = z.object({
	email: commonSchemaField.emailField,
});
