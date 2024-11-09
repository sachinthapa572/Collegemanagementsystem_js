import { model, Schema } from 'mongoose';

const ClassLevelSchema = new Schema(
	{
		// student kun year ma cha vanerw refrence
		// level 100 , 200 , 300 , 400
		// (1st yrs , 2nd , 3rd,4th) ..
		name: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		description: {
			type: String,
		},
		createdBy: {
			type: Schema.Types.ObjectId,
			ref: 'Admin',
			required: true,
		},
		//students will be added to the class level when they are registered
		students: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Student',
			},
		],
		//optional.
		subjects: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Subject',
			},
		],
		teachers: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Teacher',
			},
		],
	},
	{ timestamps: true }
);

const ClassLevel = model('ClassLevel', ClassLevelSchema);

export default ClassLevel;
