import mongoose, { model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { environmentVariables } from '../../constant.js';

const teacherSchema = new Schema(
	{
		username: {
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
		dateEmployed: {
			type: Date,
			default: Date.now,
		},
		teacherId: {
			type: String,
			required: true,
			default: function () {
				return (
					'TEA-' +
					Math.floor(100 + Math.random() * 900) +
					'-' +
					Date.now().toString().slice(2, 4) +
					'-' +
					this.username
						.split(' ')
						.map((name) => name[0])
						.join('')
						.toUpperCase()
				);
			},
		},
		//if withdrawn, the teacher will not be able to login
		isWithdrawn: {
			type: Boolean,
			default: false,
		},
		//if suspended, the teacher can login but cannot perform any task
		isSuspended: {
			type: Boolean,
			default: false,
		},
		role: {
			type: String,
			default: 'teacher',
		},
		subject: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Subject',
			// required: true,
		},
		applicationStatus: {
			type: String,
			enum: ['pending', 'approved', 'rejected'],
			default: 'pending',
		},

		program: {
			type: String,
		},
		//A teacher can teach in more than one class level
		classLevel: {
			type: String,
		},
		academicYear: {
			type: String,
		},
		examsCreated: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Exam',
			},
		],
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Admin',
			// required: true,
		},
		academicTerm: {
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

// mongoose middleware that hash the password before saving

teacherSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		next();
	}
	// hash the password
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
	next();
});

// compare the password
teacherSchema.methods.isPasswordCorrect = async function (password) {
	// return true or false
	return await bcrypt.compare(password, this.password);
};

// tokens
teacherSchema.methods.generateAccessToken = function () {
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
teacherSchema.methods.generateRefreshToken = function () {
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
const Teacher = model('Teacher', teacherSchema);

export default Teacher;
