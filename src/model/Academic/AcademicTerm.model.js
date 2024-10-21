import { model, Schema } from 'mongoose';

const academicTermSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		duration: {
			type: String,
			required: true,
			default: '6 months',
		},
		createdBy: {
			type: Schema.Types.ObjectId,
			ref: 'Admin',
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const AcademicTerm = model('AcademicTerm', academicTermSchema);

export default AcademicTerm;
