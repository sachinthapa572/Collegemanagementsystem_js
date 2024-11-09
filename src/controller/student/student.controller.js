import AsyncHandler from 'express-async-handler';
import {
	cookiesOptions,
	studentImageDirectory,
} from '../../constant.js';
import AcademicYear from '../../model/Academic/AcademicYear.model.js';
import ClassLevel from '../../model/Academic/ClassLevel.model.js';
import Program from '../../model/Academic/Program.model.js';
import ApiError from '../../utils/ApiError.js';
import withTransaction from '../../utils/withTransaction.js';
import Student from '../../model/student/Student.model.js';
import removeMulterUploadFiles from '../../utils/Images/removeMulterUploadFiles.js';
import handleImageUpload from '../../utils/Images/handleImageUploadUtils.js';
import Admin from '../../model/Staff/Admin.model.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { generateAccessTokenAndRefreshToken } from '../../utils/authTokenGenerator.js';
import { backupAndDelete } from '../../utils/backupUtils.js';
import { hashPassword } from '../../utils/hashPassword.js';

//* @desc Register a student
//* @route POST /api/v1/students/register/admin
//* @access Private (Admin only)

export const RegisterStudentController = AsyncHandler(
	async (req, res, next) => {
		const createdBy = req?.user?._id;
		const {
			username,
			email,
			password,
			academicYear,
			dateAdmitted,
			program,
		} = req.body;
		const avatarLocalPath = req.file ? req.file.path : null;

		if (!avatarLocalPath) {
			throw new ApiError(400, 'Please upload an image');
		}

		// perform the transaction with the session so that the operation can be rolled back if any error occurs during the operation

		const result = await withTransaction(async (session) => {
			const isEmailTaken = await Student.exists({ email }).session(
				session
			);
			if (isEmailTaken) {
				removeMulterUploadFiles(avatarLocalPath);
				throw new ApiError(
					400,
					'Student with this email already exists'
				);
			}

			const [programExist, academicYearExist] = await Promise.all([
				Program.findById(program).session(session),
				AcademicYear.findById(academicYear).session(session),
			]);

			if (!programExist || !academicYearExist) {
				removeMulterUploadFiles(avatarLocalPath);
				throw new ApiError(
					404,
					`${!programExist ? 'Program' : 'Academic Year'} not found`
				);
			}
			const __imageDir = studentImageDirectory(
				academicYearExist.name
			);
			// Upload image to Cloudinary
			const userImageUrl = await handleImageUpload(
				avatarLocalPath,
				null,
				__imageDir,
				next
			);

			const student = await Student.create(
				[
					{
						username,
						email,
						password,
						academicYear,
						dateAdmitted,
						program,
						createdBy,
						userImage: userImageUrl,
					},
				],
				{ session }
			);

			await Promise.all([
				Admin.findByIdAndUpdate(
					createdBy,
					{ $push: { students: student._id } },
					{ session }
				),
				AcademicYear.findByIdAndUpdate(
					academicYear,
					{ $push: { students: student._id } },
					{ session }
				),
				Program.findByIdAndUpdate(
					program,
					{ $push: { students: student._id } },
					{ session }
				),
			]);

			return student;
		});

		res.status(201).json(
			new ApiResponse(
				201,
				result,
				'Student registered successfully'
			)
		);
	}
);

//* @desc login student
//* @route POST /api/v1/students/login
//* @access Public

export const LoginStudentController = AsyncHandler(
	async (req, res, next) => {
		const { email, password } = req.body;

		// check if the email exist
		const currentUser = await Student.findOne({ email });
		if (!currentUser) {
			throw new ApiError(
				404,
				"User with this email doesn't exist"
			);
		}

		// check if the password match
		const isPasswordValid =
			await currentUser.isPasswordCorrect(password);
		if (!isPasswordValid) {
			throw new ApiError(401, 'Invalid credentials , try again');
		}

		const { refreshToken, accessToken } =
			await generateAccessTokenAndRefreshToken(
				Student,
				currentUser._id,
				next
			);

		let loginStudentDetails = await Student.findById(
			currentUser._id
		).select('-password -refreshToken');

		loginStudentDetails = {
			...loginStudentDetails._doc,
			accessToken: `Bearer ${accessToken}`,
			refreshToken: `Bearer ${refreshToken}`,
		};
		return res
			.status(200)
			.cookie('accessToken', accessToken, cookiesOptions)
			.cookie('refreshToken', refreshToken, cookiesOptions)
			.json(
				new ApiResponse(
					200,
					loginStudentDetails,
					'Student logged in successfully'
				)
			);
	}
);

//* @desc Get all students
//* @route GET /api/v1/students/admin
//* @access Private (Admin only)

export const GetAllStudentsController = AsyncHandler(
	async (_, res) => {
		const students = await Student.find({}).select(
			'-password -refreshToken'
		);

		res.status(200).json(
			new ApiResponse(
				200,
				{
					students,
					count: students.length,
				},
				'All students fetched successfully'
			)
		);
	}
);

//* @desc Get a student by id
//* @route GET /api/v1/students/:id/admin
//* @access Private (Admin only)

export const GetStudentByIdController = AsyncHandler(
	async (req, res, next) => {
		const student = await Student.findById(req.params.id).select(
			'-password -refreshToken'
		);

		if (!student) {
			throw new ApiError(404, 'No details found for this id');
		}

		res.status(200).json(
			new ApiResponse(200, student, 'Student fetched successfully')
		);
	}
);

//* @desc get current student details
//* @route GET /api/v1/students/profile
//* @access Private (Student only)

export const GetStudentDetailsController = AsyncHandler(
	async (req, res, next) => {
		const student = await Student.findById(req.user._id).select(
			'-password -refreshToken'
		);

		if (!student) {
			throw new ApiError(404, 'No details found for this id');
		}

		res.status(200).json(
			new ApiResponse(200, student, 'Student fetched successfully')
		);
	}
);

//* @desc Update student details
//* @route PUT /api/v1/students/update
//* @access Private (Student only)

export const UpdateStudentDetailsController = AsyncHandler(
	async (req, res) => {
		let { username, email, oldPassword, newPassword } = req.body;

		// Check if the current Student exists
		const currentStudent = await Student.findById(req.user._id);
		if (!currentStudent) {
			throw new ApiError(404, 'Student not found');
		}

		// Check if email is already in use by another Student
		if (email && email !== currentStudent.email) {
			const emailExists = await Student.findOne({ email });
			if (emailExists) {
				throw new ApiError(400, 'Email already exists');
			}
		}

		// Password update logic
		if (oldPassword && newPassword) {
			// check old password
			const isOldPasswordCorrect =
				await currentStudent.isPasswordCorrect(oldPassword);
			if (!isOldPasswordCorrect) {
				throw new ApiError(401, 'Invalid old password');
			}

			// check new password is same as the previous password
			const isNewPasswordSame =
				await currentStudent.isPasswordCorrect(newPassword);

			if (isNewPasswordSame) {
				throw new ApiError(
					400,
					'New password cannot be the same as the old password'
				);
			}

			// hash the new password
			currentStudent.password = await hashPassword(newPassword);
		}

		// Update Student details
		const updatedStudent = await Student.findByIdAndUpdate(
			req.user._id,
			{
				$set: {
					username,
					email,
					password: currentStudent.password,
				},
			},
			{
				new: true,
				runValidators: true,
			}
		).select('-password -refreshToken');

		if (!updatedStudent) {
			throw new ApiError(
				500,
				'Error occurred while updating Student details'
			);
		}

		// Send a success response
		return res
			.status(200)
			.json(
				new ApiResponse(
					200,
					updatedStudent,
					'Student details updated successfully'
				)
			);
	}
);

//* @desc Update student details by admin
//* @route PUT /api/v1/students/:id/update/admin
//* @access Private (Admin only)

export const UpdateStudentDetailsByAdminController = AsyncHandler(
	async (req, res, next) => {
		const {
			username,
			email,
			academicYear,
			dateAdmitted,
			program,
			classLevels,
			prefectName,
			isPromotedToLevel2ndYear,
			isPromotedToLevel3rdYear,
			isPromotedToLevel4thYear,
			isGraduated,
			isWithdrawn,
			isSuspended,
		} = req.body;

		const avatarLocalPath = req.file ? req.file.path : null;

		const result = await withTransaction(async (session) => {
			const currentStudent = await Student.findById(req.params.id);
			if (!currentStudent)
				throw new ApiError(404, 'Student not found');

			let userImage = currentStudent.userImage;

			if (program) {
				const programExist = await Program.findById(program);
				if (!programExist)
					throw new ApiError(404, 'Program not found');
			}

			let academicYearExist;
			if (academicYear) {
				academicYearExist =
					await AcademicYear.findById(academicYear);
				if (!academicYearExist)
					throw new ApiError(404, 'Academic Year not found');
			}

			// Check for duplicate email in other students
			if (email && email !== currentStudent.email) {
				const emailExists = await Student.findOne({
					email,
					_id: { $ne: req.params.id },
				});
				if (emailExists)
					throw new ApiError(
						400,
						'Student with this email already exists'
					);
			}

			// Upload image to Cloudinary
			const __imageDir = studentImageDirectory(
				academicYearExist
					? academicYearExist.name
					: currentStudent.academicYear.name
			);
			const userImageUrl = await handleImageUpload(
				avatarLocalPath,
				userImage,
				__imageDir,
				next
			);

			// Update fields Query
			const updateFields = {
				$set: {
					...(username && { username }),
					...(email && { email }),
					...(academicYear && { academicYear }),
					...(program && { program }),
					...(dateAdmitted && { dateAdmitted }),
					...(prefectName && { prefectName }),
					...(userImageUrl && { userImage: userImageUrl }),
					...(isPromotedToLevel2ndYear !== undefined && {
						isPromotedToLevel2ndYear,
					}),
					...(isPromotedToLevel3rdYear !== undefined && {
						isPromotedToLevel3rdYear,
					}),
					...(isPromotedToLevel4thYear !== undefined && {
						isPromotedToLevel4thYear,
					}),
					...(isGraduated !== undefined && { isGraduated }),
					...(isWithdrawn !== undefined && { isWithdrawn }),
					...(isSuspended !== undefined && { isSuspended }),
				},
			};

			// Add class levels to the student
			// addToSet ==> add to the array if it doesn't exist(avoid duplicates)
			if (classLevels) {
				const classLevelsExist = await ClassLevel.findOne({
					_id: { $in: classLevels },
				});
				if (!classLevelsExist)
					throw new ApiError(404, 'Class Level not found');

				updateFields.$addToSet = { classLevels };
			}

			// Update the student details
			const updatedStudent = await Student.findByIdAndUpdate(
				req.params.id,
				updateFields,
				{ new: true, runValidators: true, session }
			).select('-password -refreshToken');

			if (!updatedStudent)
				throw new ApiError(
					500,
					'Error occurred while updating Student details'
				);

			return updatedStudent;
		});

		return res
			.status(200)
			.json(
				new ApiResponse(
					200,
					result,
					'Student details updated successfully'
				)
			);
	}
);

//* @desc Delete student
//* @route DELETE /api/v1/students/:id/delete/admin
//* @access Private (Admin only)

export const DeleteStudentController = AsyncHandler(
	async (req, res) => {
		const student = await Student.findByIdAndDelete(req.params.id);

		if (!student) {
			throw new ApiError(404, 'Student not found');
		}

		const deletedData = await backupAndDelete(
			Student,
			req.params.id,
			student,
			'Error while deleting student'
		);

		const createdBy = student.createdBy;

		await Promise.all([
			Admin.findByIdAndUpdate(createdBy, {
				$pull: { students: student._id },
			}),
			AcademicYear.findByIdAndUpdate(deletedData.academicYear, {
				$pull: { students: student._id },
			}),
			Program.findByIdAndUpdate(deletedData.program, {
				$pull: { students: student._id },
			}),
		]);

		// Send a success response
		return res
			.status(200)
			.json(
				new ApiResponse(200, {}, 'Student deleted successfully')
			);
	}
);

//* @desc logout the student
//* @route GET /api/v1/students/logout
//* @access Private (Student only)

export const LogoutStudentController = AsyncHandler(
	async (req, res) => {
		const student = await Student.findByIdAndUpdate(req.user._id, {
			$set: { refreshToken: '' },
		});

		if (!student) {
			throw new ApiError(500, 'Error occurred while logging out');
		}

		// Send a success response
		return res
			.status(200)
			.clearCookie('accessToken')
			.clearCookie('refreshToken')
			.json(
				new ApiResponse(
					200,
					{},
					'Student logged out successfully'
				)
			);
	}
);
