import { z } from 'zod';

const usernameField = z
	.string()
	.min(1, { message: "Username can't be empty" })
	.max(15, { message: "Username can't be more than 15 characters" })
	// .regex(/^[a-zA-Z0-9_]+$/, { message: "Username can only contain letters, numbers, and underscores" });

const emailField = z
	.string()
	.email({ message: 'Invalid email address' })
	.regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, { message: 'Email must be a valid format' });

const passwordField = z
	.string()
	// .min(6, { message: 'Password must be at least 6 characters long' })
	// .max(15, { message: 'Password can\'t be more than 15 characters' })
	// .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
	// .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
	// .regex(/[0-9]/, { message: 'Password must contain at least one number' })
	// .regex(/[@$!%*?&#]/, { message: 'Password must contain at least one special character' });

const roleField = z.enum(['admin', 'teacher', 'student'], {
	message: 'Invalid role',
});

const nameField = z
	.string()
	.min(1, { message: "Name can't be empty" })
	.max(50, { message: "Name can't be more than 50 characters" })
	.regex(/^[a-zA-Z\s]+$/, { message: "Name can only contain letters and spaces" });

const fromYearField = z
	.number({ message: 'fromYear must be a number' })
	.int({ message: 'fromYear must be an integer' })
	.min(1900, { message: 'fromYear must be after 1900' })
	.max(new Date().getFullYear(), { message: `fromYear can't be in the future` });

const toYearField = z
	.number({ message: 'toYear must be a number' })
	.int({ message: 'toYear must be an integer' })
	.min(1900, { message: 'toYear must be after 1900' })
	.max(new Date().getFullYear(), { message: `toYear can't be in the future` });

const descriptionField = z
	.string()
	.max(200, { message: "Description can't be more than 200 characters" })
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