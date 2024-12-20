import { model, Schema } from 'mongoose';

//examSchema
const examSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		subject: {
			type: Schema.Types.ObjectId,
			ref: 'Subject',
			required: true,
		},
		program: {
			type: Schema.Types.ObjectId,
			ref: 'Program',
			required: true,
		},
		passMark: {
			type: Number,
			required: true,
			default: 32,
		},
		totalMark: {
			type: Number,
			required: true,
			default: 100,
		},

		academicTerm: {
			type: Schema.Types.ObjectId,
			ref: 'AcademicTerm',
			required: true,
		},
		duration: {
			type: String,
			required: true,
			default: '3', // 3 hours
		},
		examDate: {
			type: Date,
			required: true,
			default: new Date(),
		},
		examTime: {
			type: String,
			required: true,
		},
		endTime: {
			type: String,
			required: true,
		},
		examType: {
			type: String,
			required: true,
			default: 'MCQ',
		},
		examStatus: {
			type: String,
			required: true,
			default: 'pending',
			enum: {
				values: ['pending', 'ongoing', 'completed', 'cancelled'],
				message: 'Exam status must be either pending, ongoing, or completed , cancelle',
			},
		},
		questions: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Question',
			},
		],
		classLevel: {
			type: Schema.Types.ObjectId,
			ref: 'ClassLevel',
			required: true,
		},
		createdBy: {
			type: Schema.Types.ObjectId,
			ref: 'Teacher',
			required: true,
		},
		academicTerm: {
			type: Schema.Types.ObjectId,
			ref: 'AcademicTerm',
			required: true,
		},
		academicYear: {
			type: Schema.Types.ObjectId,
			ref: 'AcademicYear',
			required: true,
		},
	},
	{ timestamps: true }
);

const Exam = model('Exam', examSchema);

export default Exam;
