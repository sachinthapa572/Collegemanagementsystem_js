import { model, Schema } from 'mongoose';
import Counter from '../Academic/Counter.model.js';
import ApiError from '../../utils/ApiError.js';
import { environmentVariables } from '../../constant.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const studentSchema = new Schema(
	{
		username: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		studentId: {
			type: String,
			unique: true,
		},
		role: {
			type: String,
			default: 'student',
			immutable: [true, 'Role cannot be changed'],
		},
		// in which year the student is
		classLevels: [
			{
				type: Schema.Types.ObjectId,
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
			type: Schema.Types.ObjectId,
			ref: 'AcademicYear',
		},
		dateAdmitted: {
			type: Date,
			default: Date.now,
		},
		examResults: [
			{
				type: Schema.Types.ObjectId,
				ref: 'ExamResult',
			},
		],

		program: {
			type: Schema.Types.ObjectId,
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
		refreshToken: {
			type: String,
		},
		userImage: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

studentSchema.pre('save', async function (next) {
	// if document isNot new or password hasNot modified then skip
	if (!this.isNew || !this.isModified('password')) return next();

	try {
		// upsert ==> yedi document xaina vane create garcha

		const counter = await Counter.findByIdAndUpdate(
			{ _id: 'studentCounter' },
			{ $inc: { seq: 1 } },
			{ new: true, upsert: true }
		);
		// Set the studentId with a prefix and padded sequence number (e.g., "STU0001")
		this.studentId = `STU${counter.seq.toString().padStart(4, '0')}`;

		// hash the password
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
		next();
	} catch (error) {
		next(new ApiError(500, 'Something went wrong Try again later'));
	}
});

// compare the password
studentSchema.methods.isPasswordCorrect = async function (password) {
	// return true or false
	return await bcrypt.compare(password, this.password);
};

// tokens
studentSchema.methods.generateAccessToken = function () {
	return jwt.sign(
		{
			_id: this._id,
		},
		environmentVariables.ACCESS_TOKEN_SECRET,
		{
			expiresIn: environmentVariables.ACCESS_TOKEN_EXPIRES_IN,
		}
	);
};
studentSchema.methods.generateRefreshToken = function () {
	return jwt.sign(
		{
			_id: this._id,
			email: this.email,
			username: this.username,
			role: this.role,
		},
		environmentVariables.REFRESH_TOKEN_SECRET,
		{
			expiresIn: environmentVariables.REFRESH_TOKEN_EXPIRES_IN,
		}
	);
};

//model
const Student = model('Student', studentSchema);

export default Student;
