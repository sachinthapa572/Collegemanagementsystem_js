import { model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { environmentVariables } from '../../constant.js';

const adminSchema = new Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		password: {
			type: String,
			required: true,
		},
		role: {
			type: String,
			default: 'admin',
		},
		refreshToken: {
			type: String,
		},
		userImage: {
			type: String,
			required: true,
		},
		academicTerms: [
			{
				type: Schema.Types.ObjectId,
				ref: 'AcademicTerm',
			},
		],
		academicYears: [
			{
				type: Schema.Types.ObjectId,
				ref: 'AcademicYear',
			},
		],
		classLevels: [
			{
				type: Schema.Types.ObjectId,
				ref: 'ClassLevel',
			},
		],
		teachers: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Teacher',
			},
		],
		students: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Student',
			},
		],
	},
	{
		timestamps: true,
	}
);

// moongoose middelware

adminSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		next();
	}
	// hash the password
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
	next();
});

// compare the password
adminSchema.methods.isPasswordCorrect = async function (password) {
	// return true or false
	return await bcrypt.compare(password, this.password);
};

// tokens
adminSchema.methods.generateAccessToken = function () {
	return jwt.sign(
		{
			_id: this._id,
		},
		environmentVariables.ACCESS_TOKEN_SECRET,
		{
			expiresIn: environmentVariables.REFRESH_TOKEN_EXPIRES_IN,
		}
	);
};
adminSchema.methods.generateRefreshToken = function () {
	return jwt.sign(
		{
			_id: this._id,
			email: this.email,
			username: this.username,
			role: this.role,
		},
		environmentVariables.ACCESS_TOKEN_SECRET,
		{
			expiresIn: environmentVariables.ACCESS_TOKEN_EXPIRES_IN,
		}
	);
};

adminSchema.methods.toJSON = function () {
	const admin = this.toObject();
	delete admin.password;
	delete admin.refreshToken;
	return admin;
};

const Admin = model('Admin', adminSchema);

export default Admin;
