import { model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

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
adminSchema.methods.matchPasswords = async function (enterPassword) {
	// return true or false
	return  bcrypt.compare(enterPassword, this.password);
};

// model

const Admin = model('Admin', adminSchema);

export default Admin;
