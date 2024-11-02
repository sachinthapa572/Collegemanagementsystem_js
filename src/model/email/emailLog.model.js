import mongoose from 'mongoose';

const emailLogSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			trim: true,
		},
		subject: {
			type: String,
			required: true,
		},
		html: {
			type: String,
			required: true,
		},
		status: {
			type: String,
			enum: ['pending', 'sent', 'failed'],
			default: 'pending',
		},
		attempts: {
			type: Number,
			default: 0,
			min: 0,
		},
		max_attempts: {
			type: Number,
			default: 5,
			immutable: true,
		},
		attachments: [
			{
				filename: String,
				path: String,
				cid: String,
			},
		],
	},
	{
		timestamps: true,
	}
);

// Export the model
const EmailLog = mongoose.model('EmailLog', emailLogSchema);

export default EmailLog;
