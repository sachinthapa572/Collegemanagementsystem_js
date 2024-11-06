import { model, Schema } from 'mongoose';

const subjectSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			required: true,
			trim: true,
		},
		teacher: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Teacher',
			},
		],
		createdBy: {
			type: Schema.Types.ObjectId,
			ref: 'Admin',
			required: true,
			immutable: [true, 'Cannot be changed'],
		},
		duration: {
			type: String,
			required: true,
			default: '6 months',
			immutable: [true, 'Cannot be changed'],
		},
		academicYear: {
			type: Schema.Types.ObjectId,
			ref: 'AcademicYear',
			required: true,
		},
		academicTerm: {
			type: Schema.Types.ObjectId,
			ref: 'AcademicTerm',
			required: true,
		},
		program: {
			type: Schema.Types.ObjectId,
			ref: 'Program',
			required: true,
		},
	},
	{ timestamps: true }
);

const Subject = model('Subject', subjectSchema);
export default Subject;
