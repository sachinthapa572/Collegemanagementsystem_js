import { createTransport } from 'nodemailer';
import { SignUpMailFormat } from './index.js';
import EmailLog from '../../model/email/emailLog.model.js';

const sendMail = async ({ username, email }, next = () => {}) => {
	const transporter = createTransport({
		service: 'gmail',
		auth: {
			user: process.env.HOST_EMAIL,
			pass: process.env.HOST_EMAIL_PASSWORD,
		},
	});

	const mailOptions = SignUpMailFormat(username, email);

	try {
		const info = await transporter.sendMail(mailOptions);

		// Log success in the database
		await EmailLog.create({
			username,
			email,
			subject: mailOptions.subject,
			html: mailOptions.html,
			status: 'sent',
			attachments: mailOptions.attachments || [],
		});
		console.log(`Email sent successfully: ${info.messageId}`);
	} catch (error) {
		console.error(
			`Failed to send email to ${email}: ${error.message}`
		);

		await EmailLog.create({
			username,
			email,
			subject: mailOptions.subject,
			html: mailOptions.html,
			status: 'failed',
			attempts: 1,
		});

		next();
	}
};

export default sendMail;
