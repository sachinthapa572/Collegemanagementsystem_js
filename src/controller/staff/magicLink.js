import AsyncHandler from 'express-async-handler';

import { Staff } from '../../models/staff';
import { sendMagicLink } from '../../services/magicLink';

export const sendMagicLinkController = AsyncHandler(
	async (req, res) => {
		const { email } = req.body;

		const staff = await Staff.findOne({ email }).select('email');

		if (!staff) {
			return res.status(404).send('Staff not found');
		}

		await sendMagicLink(staff.email);

		res.status(200).send('Magic link sent');
	}
);



export const er = AsyncHandler(
	async (req, res) => {
		const { email } = req.body;

		const staff = await Staff.findOne({ email }).select('email');

		if (!staff) {
			return res.status(404).send('Staff not found');
		}

		await sendMagicLink(staff.email);

		res.status(200).send('Magic link sent');
	}
);
