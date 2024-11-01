import AsyncHandler from 'express-async-handler';
import Program from '../../model/Academic/Program.model.js';
import Subject from '../../model/Academic/Subject.model.js';
import AcademicTerm from '../../model/Academic/AcademicTerm.model.js';
import ApiError from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import {
	createSubjectSchema,
	updateSubjectSchema,
} from '../../utils/Validation/course.schema.js';
import AcademicYear from '../../model/Academic/AcademicYear.model.js';

//* @ desc Create a new subject
//* @ route POST /api/v1/academics/subject/:programId
//* @ access Private

export const createSubject = AsyncHandler(async (req, res) => {
	const validationResult = createSubjectSchema.parse(req.body);

	const { name, description, academicTerm, academicYear } =
		validationResult;
	const createdBy = req?.user?._id;
	const programExist = await Program.findById(req.params.programId);
	if (!programExist) {
		throw new ApiError(404, 'Program not found');
	}

	const term = await AcademicTerm.findById(academicTerm);
	if (!term) {
		throw new ApiError(404, 'Academic term not found');
	}

	const fetchedSubject = await Subject.findOne({
		name,
		program: req.params.programId,
		academicTerm,
	});
	if (fetchedSubject) {
		throw new ApiError(
			400,
			'Subject already exists in this program'
		);
	}

	const newSubject = await Subject.create({
		name,
		description,
		academicTerm,
		academicYear,
		program: req.params.programId,
		createdBy,
	});

	programExist.courses.push(newSubject._id);
	await programExist.save();

	res.status(201).json(
		new ApiResponse(201, 'Subject created successfully', newSubject)
	);
});

//* @ desc Get all subjects in a program and the subject by ID
//* @ route GET /api/v1/academics/subjects/:programId?academicTerm=termId&academicYear=year&subjectId=subjectId
//* @ access Private

export const getSubjects = AsyncHandler(async (req, res) => {
	const programId = req.params?.programId;
	const { academicTerm, academicYear, subjectId } = req.query;

	// Check if the program exists
	const program = await Program.findById(programId);
	if (!program) {
		throw new ApiError(404, 'Program not found');
	}

	if (subjectId) {
		const subject = await Subject.findOne({
			_id: subjectId,
			program: programId,
		});

		if (!subject) {
			throw new ApiError(404, 'Subject not found');
		}

		return res
			.status(200)
			.json(
				new ApiResponse(
					200,
					'Subject fetched successfully',
					subject
				)
			);
	}

	if (academicTerm) {
		const term = await AcademicTerm.findById(academicTerm);
		if (!term) {
			throw new ApiError(404, 'Academic term not found');
		}
	}

	if (academicYear) {
		const year = await AcademicYear.findById(academicYear);
		if (!year) {
			throw new ApiError(404, 'Academic year not found');
		}
	}
	// Build the subject query dynamically for all subjects
	const subjectQuery = {
		...(programId && {
			program: programId,
		}),
		...(academicTerm && {
			academicTerm,
		}),
		...(academicYear && {
			academicYear,
		}),
	};

	const subjects = await Subject.find(subjectQuery);

	res.status(200).json(
		new ApiResponse(
			200,
			'Subjects fetched successfully for the program and term',
			subjects
		)
	);
});

//* @ desc Get a subject by ID
//* @ route GET /api/v1/academics/subject/:programId/:id
//* @ access Private

// export const getSubjectById = AsyncHandler(async (req, res) => {
// 	const subject = await Subject.findOne({ _id: req.params.id, program: req.params.programId });

// 	if (!subject) {
// 		throw new ApiError(404, 'Subject not found');
// 	}

// 	res.status(200).json(
// 		new ApiResponse(
// 			200,
// 			'Subject fetched successfully',
// 			subject
// 		)
// 	);
// });

//* @ desc Update a subject by ID
//* @ route PUT /api/v1/academics/subjects/:programId?academicTerm=termId&academicYear=year&subjectId=subjectId
//* @ access Private

export const updateSubject = AsyncHandler(async (req, res) => {
	// Validate the request body
	const validatedData = updateSubjectSchema.parse(req.body);
	const {
		name,
		description,
		SendAcademicTerm,
		SendAcademicYear,
		sendProgram,
	} = validatedData;

	const { programId } = req.params;
	const { subjectId, academicTerm, academicYear } = req.query;

	// Check if the program exists
	const program = await Program.findById(programId);
	if (!program) {
		throw new ApiError(404, 'Program not found');
	}

	if (academicTerm) {
		const term = await AcademicTerm.findById(academicTerm);
		if (!term) {
			throw new ApiError(404, 'Academic term not found');
		}
	}

	if (academicYear) {
		const year = await AcademicYear.findById(academicYear);
		if (!year) {
			throw new ApiError(404, 'Academic year not found');
		}
	}

	if (!subjectId) {
		throw new ApiError(400, 'Subject ID is required for updating');
	}

	const subject = await Subject.findOne({
		_id: subjectId,
		program: programId,
	});
	if (!subject) {
		throw new ApiError(404, 'Subject not found');
	}

	const duplicateCheck = await Subject.findOne({
		name,
		program: programId,
		academicTerm: SendAcademicTerm,
		academicYear: SendAcademicYear,
		_id: {
			$ne: subjectId,
		},
	});
	if (duplicateCheck) {
		throw new ApiError(
			400,
			'Another subject with this name already exists in this program, term, and year'
		);
	}

	// Construct the update object dynamically based on provided fields
	const updateDataQuery = {
		...(name && {
			name,
		}),
		...(description && {
			description,
		}),
		...(SendAcademicTerm && {
			academicTerm: SendAcademicTerm,
		}),
		...(SendAcademicYear && {
			academicYear: SendAcademicYear,
		}),
		...(sendProgram && {
			program: sendProgram,
		}),
	};

	const updatedSubject = await Subject.findByIdAndUpdate(
		subjectId,
		{
			$set: updateDataQuery,
		},
		{
			new: true,
			runValidators: true,
		}
	);

	res.status(200).json(
		new ApiResponse(
			200,
			'Subject updated successfully',
			updatedSubject
		)
	);
});

//* @ desc Delete a subject by ID
//* @ route DELETE /api/v1/academics/subjects/:programId?subjectId=subjectId&academicTerm=termId&academicYear=year
//* @ access Private

export const deleteSubject = AsyncHandler(async (req, res) => {
	const programId = req.params.programId;
	const { subjectId, academicTerm, academicYear } = req.query;

	if (academicTerm) {
		const term = await AcademicTerm.findById(academicTerm);
		if (!term) {
			throw new ApiError(404, 'Academic term not found');
		}
	}

	if (academicYear) {
		const year = await AcademicYear.findById(academicYear);
		if (!year) {
			throw new ApiError(404, 'Academic year not found');
		}
	}

	const program = await Program.findById(programId);
	if (!program) {
		throw new ApiError(
			404,
			'Program not found for the given term and year'
		);
	}

	const subjectQuery = {
		_id: subjectId,
		program: programId,
		...(academicTerm && {
			academicTerm,
		}),
		...(academicYear && {
			academicYear,
		}),
	};

	const subject = await Subject.findOne(subjectQuery);
	if (!subject) {
		throw new ApiError(
			404,
			'Subject not found for the given program, term, and year'
		);
	}

	await Subject.findByIdAndDelete(subjectId);

	// Remove the subject from the program's list of courses when the subject is deleted
	await Program.updateOne(
		{
			_id: programId,
		},
		{
			$pull: {
				courses: subjectId,
			},
		}
	);

	res.status(200).json(
		new ApiResponse(200, 'Subject deleted successfully')
	);
});
