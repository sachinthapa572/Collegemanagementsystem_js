import { model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {
	ACCESS_TOKEN_EXPIRES_IN,
	ACCESS_TOKEN_SECRET,
	REFRESH_TOKEN_EXPIRES_IN,
	REFRESH_TOKEN_SECRET,
} from '../../constant.js';

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
		REFRESH_TOKEN_SECRET,
		{
			expiresIn: REFRESH_TOKEN_EXPIRES_IN,
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
		ACCESS_TOKEN_SECRET,
		{
			expiresIn: ACCESS_TOKEN_EXPIRES_IN,
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
