import EmailLog from '../../model/email/emailLog.model.js';
import sendMail from './nodeMailer.js';

const retryFailedEmails = async () => {
	console.log('called');
	try {
		const failedEmails = await EmailLog.find({
			status: 'failed',
			attempts: { $lt: 5 },
		})
			.sort({ updated_at: 1 })
			.limit(10)
			.exec();

		for (let emailLog of failedEmails) {
			try {
				await sendMail({
					username: emailLog.username,
					email: emailLog.email,
				});
				console.log(
					`Successfully retried email to: ${emailLog.email}`
				);

				await EmailLog.updateOne(
					{ _id: emailLog._id },
					{
						$set: { status: 'sent', updated_at: new Date() },
						$inc: { attempts: 1 },
					}
				);
			} catch (error) {
				console.error(
					`Retry failed for email to ${emailLog.email}: ${error.message}`
				);

				await EmailLog.updateOne(
					{ _id: emailLog._id },
					{ $inc: { attempts: 1 } }
				);

				if (emailLog.attempts + 1 >= emailLog.max_attempts) {
					console.error(
						`Max attempts reached for email to ${emailLog.email}`
					);
					// send the mail to the admin about the failed email
				}
			}
		}
	} catch (error) {
		console.error(`Error in retryFailedEmails: ${error.message}`);
	}
};

export default retryFailedEmails;
