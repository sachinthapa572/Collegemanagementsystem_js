import { model, Schema } from 'mongoose';

const studentSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},

		//! fixed this student id should be based on the ascending order
		studentId: {
			type: String,
			required: true,
			default: function () {
				return (
					'STU' +
					Math.floor(100 + Math.random() * 900) +
					Date.now().toString().slice(2, 4) +
					this.name
						.split(' ')
						.map((name) => name[0])
						.join('')
						.toUpperCase()
				);
			},
		},
		role: {
			type: String,
			default: 'student',
		},
		//Classes are from level 1 to 8 semster
		//keep track of the semester level the student is in
		classLevels: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'ClassLevel',
			},
		],
		currentClassLevel: {
			type: String,
			default: function () {
				return this.classLevels[this.classLevels.length - 1];
			},
		},
		academicYear: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'AcademicYear',
		},
		dateAdmitted: {
			type: Date,
			default: Date.now,
		},
		examResults: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'ExamResult',
			},
		],

		program: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Program',
		},

		isPromotedToLevel2ndYear: {
			type: Boolean,
			default: false,
		},
		isPromotedToLevel3rdYear: {
			type: Boolean,
			default: false,
		},
		isPromotedToLevel4thYear: {
			type: Boolean,
			default: false,
		},
		isGraduated: {
			type: Boolean,
			default: false,
		},
		isWithdrawn: {
			type: Boolean,
			default: false,
		},
		isSuspended: {
			type: Boolean,
			default: false,
		},
		prefectName: {
			type: String,
		},
		// behaviorReport: [
		//   {
		//     type: mongoose.Schema.Types.ObjectId,
		//     ref: "BehaviorReport",
		//   },
		// ],
		// financialReport: [
		//   {
		//     type: mongoose.Schema.Types.ObjectId,
		//     ref: "FinancialReport",
		//   },
		// ],
		//year group
		yearGraduated: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

//model
const Student = model('Student', studentSchema);

export default Student;
