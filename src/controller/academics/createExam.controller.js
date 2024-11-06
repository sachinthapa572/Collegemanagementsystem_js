import AsyncHandler from 'express-async-handler';
import Exam from '../../model/Academic/Exam.model.js';
import Teacher from '../../model/Staff/Teacher.model.js';
import ApiError from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { timeFormatter } from '../../utils/timeUtils.js';
import { examState } from '../../constant.js';
import { backupAndDelete } from '../../utils/backupUtils.js';

//*	@ desc Create a new exam
//*	@ route POST /api/v1/exams/
//*	@ access Private (teacher)

export const createExamController = AsyncHandler(async (req, res) => {
	const {
		name,
		subject,
		program,
		description,
		passMark,
		examDate,
		totalMark,
		academicTerm,
		examTime,
		duration,
		examStatus,
		classLevel,
		academicYear,
	} = req.body;
	const teacher = req.user._id;
	if (!teacher) {
		throw new ApiError(400, 'Teacher not found');
	}

	const examExists = await Exam.countDocuments({
		name,
		subject,
		program,
		academicTerm,
	});
	if (examExists > 0) {
		throw new ApiError(
			400,
			'Exam already created for this term of the program '
		);
	}

	const { startDateTime, formattedEndTime } = timeFormatter(
		examTime,
		examDate,
		duration ? duration : 3
	);

	const createdExam = await Exam.create({
		name,
		subject,
		program,
		description,
		passMark,
		examDate: startDateTime,
		totalMark,
		examTime,
		endTime: formattedEndTime,
		academicTerm,
		duration,
		examStatus,
		classLevel,
		academicYear,
		createdBy: teacher,
	});

	if (!createdExam) {
		throw new ApiError(400, 'something went wrong');
	}

	await Teacher.updateOne(
		{
			_id: req.user._id,
		},
		{
			$push: {
				examsCreated: createdExam._id,
			},
		}
	);

	res.status(201).json(
		new ApiResponse(201, 'Exam created successfully', createdExam)
	);
});

//*	@ desc Get all exams and (exam by id)
//*	@ route GET /api/v1/exams/examId
//*	@ access Private (teacher)

export const getExamsController = AsyncHandler(async (req, res) => {
	const { examId } = req.params;

	const ExamQuery = examId ? { _id: examId } : {};

	const exams = await Exam.find(ExamQuery).sort({
		createdAt: 1,
	});

	if (!exams) {
		throw new ApiError(404, 'No exam found');
	}

	const count = await Exam.estimatedDocumentCount();

	res.status(200).json(
		new ApiResponse('Exams fetched successfully', {
			exams,
			total: count,
		})
	);
});

//*	@ desc Update exam
//*	@ route PUT /api/v1/exams/examId
//*	@ access Private (teacher)

export const updateExamController = AsyncHandler(async (req, res) => {
	const { examId } = req.params;
	const {
		name,
		description,
		passMark,
		examDate,
		totalMark,
		examTime,
		duration,
		examStatus,
	} = req.body;

	const exam = await Exam.findById(examId);

	if (!exam) {
		throw new ApiError(404, 'No Exam  found');
	}

	if (examState.includes(exam.examStatus)) {
		throw new ApiError(
			400,
			'You cannot update exam that is ongoing , completed or cancelled'
		);
	}

	const { startDateTime, formattedEndTime } = timeFormatter(
		examTime,
		examDate,
		duration ? duration : 3
	);

	const updatedExam = await Exam.findByIdAndUpdate(
		examId,
		{
			$set: {
				name,
				description,
				passMark,
				examDate,
				totalMark,
				duration,
				examStatus,
				examDate: startDateTime,
				examTime,
				endTime: formattedEndTime,
			},
		},
		{
			new: true,
			runValidators: true,
		}
	);

	if (!updatedExam) {
		throw new ApiError(
			400,
			'something went wrong while updating exam'
		);
	}

	res.status(200).json(
		new ApiResponse(200, 'Exam updated successfully', updatedExam)
	);
});

//*	@ desc Delete exam
//*	@ route DELETE /api/v1/exams/examId
//*	@ access Private (teacher)

export const deleteExamController = AsyncHandler(
	async (req, res, next) => {
		const { examId } = req.params;

		const exam = await Exam.findById(examId);

		if (!exam) {
			throw new ApiError(404, 'No Exam found');
		}

		if (examState.examStatus === 'ongoing') {
			throw new ApiError(
				400,
				'You cannot delete exam that is ongoing , completed or cancelled'
			);
		}

		backupAndDelete(
			Exam,
			examId,
			exam,
			'Error while deleting exam',
			next
		);

		await Teacher.updateOne(
			{
				_id: req.user._id,
			},
			{
				$pull: {
					examsCreated: examId,
				},
			}
		);

		res.status(200).json(
			new ApiResponse(200, 'Exam deleted successfully')
		);
	}
);
