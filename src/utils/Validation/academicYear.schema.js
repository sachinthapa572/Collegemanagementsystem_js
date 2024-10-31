import { z } from 'zod';

const yearField = z
	.number()
	.int()
	.min(1900, { message: "Year must be greater than or equal to 1900" })
	.max(2100, { message: "Year must be less than or equal to 2100" });

export const createAcademicYearSchema = z.object({
	fromYear: yearField,
	toYear: yearField
}).refine(data => data.fromYear < data.toYear, {
	message: 'The first year must be less than the second year',
})
	.transform(data => {
		const name = `${data.fromYear}-${data.toYear}`;
		return {
			...data,
			name,
		};
	});

export const updateAcademicYearSchema = z.object({
	fromYear: yearField.optional(),
	toYear: yearField.optional(),
}).refine(data => {
	const atLeastOne = data.fromYear !== undefined || data.toYear !== undefined;
	const validYearOrder = data.fromYear < data.toYear || !data.fromYear || !data.toYear; // Allow if one year is missing
	return atLeastOne && validYearOrder;
}, {
	message: 'The first year must be less than the second year',
}).transform(data => {
	const result = { ...data };
	if (data.fromYear && data.toYear) {
		result.name = `${data.fromYear}-${data.toYear}`;
	}
	return result;
});