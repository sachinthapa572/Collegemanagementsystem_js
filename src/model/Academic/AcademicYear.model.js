import { Schema, model } from 'mongoose';

const academicYearSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		fromYear: {
			type: Date,
			required: true,
		},
		toYear: {
			type: Date,
			required: true,
		},
		isCurrent: {
			type: Boolean,
			default: false,
		},
		createdBy: {
			type: Schema.Types.ObjectId,
			ref: 'Admin',
			required: true,
		},
		students: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Student',
			},
		],
		teachers: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Teacher',
			},
		],
		//Finance
		//Librarian
		//......
	},
	{
		timestamps: true,
	}
);

//model
const AcademicYear = model('AcademicYear', academicYearSchema);

export default AcademicYear;
