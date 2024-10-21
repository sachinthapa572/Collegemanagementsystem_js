import { model, Schema } from 'mongoose';

const subjectSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
			lowercase: true,
		},
		description: {
			type: String,
			required: true,
			trim: true,
		},
		//! teaches by only one teacher make the array if if there are more than one teacher
		teacher: {
			type: Schema.Types.ObjectId,
			ref: 'Teacher',
		},
		academicTerm: {
			type: Schema.Types.ObjectId,
			ref: 'AcademicTerm',
			required: true,
		},
		createdBy: {
			type: Schema.Types.ObjectId,
			ref: 'Admin',
			required: true,
		},
		duration: {
			type: String,
			required: true,
			default: '6 months',
		},
	},
	{ timestamps: true }
);

const Subject = model('Subject', subjectSchema);

export default Subject;
