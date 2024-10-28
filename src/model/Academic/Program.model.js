import { model, Schema } from 'mongoose';
const fillerWords = ['of', 'and', 'the', 'in', 'for', 'with', 'on'];

const programSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
			unique: true,
		},
		description: {
			type: String,
			required: true,
		},
		duration: {
			type: String,
			required: true,
			default: '4 years',
		},

		// The first two name of the Course and the random id like Computer Science (CS 35)
		code: {
			type: String,
			default: function () {
				const courseName = this.name || '';
				const initials = courseName
					.split(' ')
					.filter(
						(word) => !fillerWords.includes(word.toLowerCase())
					)
					.map((word) => word[0])
					.join('')
					.toUpperCase();
				return initials;
			},
		},
		// relation foreign key
		createdBy: {
			type: Schema.Types.ObjectId,
			ref: 'Admin',
			required: true,
		},
		// teachers that are the onchange of the program
		teacher: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Teacher',
				default: [],
			},
		],
		// involves student in the course
		students: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Student',
				default: [],
			},
		],
		// subjects in the course
		courses: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Course',
				default: [],
			},
		],
	},
	{
		timestamps: true,
	}
);

const Program = model('Program', programSchema);

export default Program;
