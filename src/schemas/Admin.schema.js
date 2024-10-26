import { z } from 'zod';

// Define reusable fields
const usernameField = z
	.string()
	.min(1, { message: "Username can't be empty" })
	.max(15, { message: "Username can't be more than 15 characters" });

const emailField = z
	.string()
	.email({ message: 'Invalid email address' });

const passwordField = z.string().min(6, {
	message: 'Password must be at least 6 characters long',
});

const roleField = z.enum(['admin', 'teacher', 'student'], {
	message: 'Invalid role',
});

export const registerAdminSchema = z.object({
	username: usernameField,
	email: emailField,
	password: passwordField,
	role: roleField.optional(),
});

export const loginAdminSchema = z.object({
	email: emailField,
	password: passwordField,
});

export const updateAdminSchema = z
	.object({
		username: usernameField.optional(),
		email: emailField.optional(),
		oldPassword: passwordField.optional(),
		newPassword: passwordField.optional(),
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
	.refine((data) => data.newPassword !== data.oldPassword, {
		message: 'New password must be different from the old password',
		path: ['newPassword'],
	});

export const singleAdminSchema = z.object({
	email: emailField,
});
