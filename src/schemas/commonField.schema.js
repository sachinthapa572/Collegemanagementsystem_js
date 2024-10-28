import { z } from 'zod';

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

const nameField = z
	.string()
	.min(1, { message: "name can't be empty" })
	.max(50, {
		message: "name can't be more than 50 characters",
	});

const fromYearField = z.any({ message: 'fromYear is required' });

const toYearField = z.any({ message: 'toYear is required' });

const descriptionField = z
	.string()
	.max(200, {
		message: "Description can't be more than 200 characters",
	})
	.optional();

export const commonSchemaField = Object.freeze({
	usernameField,
	emailField,
	passwordField,
	roleField,
	nameField,
	fromYearField,
	toYearField,
	descriptionField,
});
