import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logoPath = path.join(__dirname, '../../../public/Photos/logo.png');

export const SignUpMailFormat = (username, email) => ({
	from: `${process.env.HOST_NAME} <${process.env.HOST_EMAIL}>`,
	to: email,
	subject: `Welcome to MySchool Management System! 🎉 Your Journey Begins Here`,
	html: `
            <div style="font-family: Arial, sans-serif; color: #333;">
                    <div style="text-align: center;">
                        <img src="cid:logo" alt="School Logo" style="width: 100px; height: auto; margin-bottom: 20px;" />
                    </div>
                    <h2 style="text-align: center; color: #4CAF50;">Welcome to MySchool Management System!</h2>
                    <p>Hi <strong>${username}</strong>,</p>
                    <p>We're excited to have you on board! This email confirms your successful sign-in to our school management system.</p>
                    <p>To get started, here are some resources and tips:</p>
                    <ul>
                        <li><strong>Explore Your Dashboard:</strong> Access your courses, schedules, and resources.</li>
                        <li><strong>Profile Settings:</strong> Update your personal information to keep your account secure.</li>
                        <li><strong>Support:</strong> Need help? Feel free to reach out to our support team.</li>
                    </ul>
                    <p style="margin-top: 20px;">If this sign-in was not done by you, please contact us immediately.</p>
                    <p>Best Regards,<br />
                    The MySchool Management Team</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                    <p style="font-size: 0.9em; color: #888;">You are receiving this email because your email address was used to sign in to MySchool Management System.</p>
                </div>
                
            `,
	attachments: [
		{
			filename: 'logo.png',
			path: logoPath,
			cid: 'logo', // same cid value as in the html img src
		},
	],
});


