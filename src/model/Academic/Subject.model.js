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

// // Remove the subject from the program's list of courses when the subject is deleted
// subjectSchema.pre('findOneAndDelete', async function (next) {

// 	const filter = this.getQuery();

// 	// Find the subject document that matches this filter
// 	const subject = await this.model.findOne(filter);

// 	// Do something with the retrieved subject, e.g., remove references from other documents
// 	if (subject) {
// 		await Program.updateOne(
// 			{ _id: subject.program },
// 			{ $pull: { courses: subject._id } }
// 		);
// 	}

// 	next();
// });

const Subject = model('Subject', subjectSchema);

export default Subject;
