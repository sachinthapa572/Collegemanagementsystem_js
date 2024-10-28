import AsyncHandler from 'express-async-handler';
import ApiError from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import Admin from '../../model/Staff/Admin.model.js';
import AcademicTerm from '../../model/Academic/AcademicTerm.model.js';
import { createAcademicTermSchema, updateAcademicTermSchema } from '../../schemas/academicTerm.schemas.js';


//*	@ desc Create a new academic Term
//*	@ route POST /api/v1/academics/academic-term
//*	@ access Private

export const createAcademicTerm = AsyncHandler(async (req, res) => {
	const { name, description, duration } =
		createAcademicTermSchema.parse(req.body);
	const createdBy = req?.user?._id;

	const academicTerm = await AcademicTerm.findOne({ name });

	if (academicTerm) {
		throw new ApiError(400, 'Academic term already exist');
	}

	const academicTermCreated = await AcademicTerm.create({
		name,
		description,
		duration,
		createdBy,
	});

	if (!academicTermCreated) {
		throw new ApiError(
			400,
			'Something went wrong wile creating the academic term'
		);
	}

	// push the academic term to the user
	const admin = await Admin.findById(req.user._id);
	admin.academicTerms.push(academicTermCreated._id);
	await admin.save();

	res.status(201).json(
		new ApiResponse(
			201,
			'Academic term created successfully',
			academicTermCreated
		)
	);
});

//*	@ desc Get all academic terms
//*	@ route GET /api/v1/academics/academic-term
//*	@ access Private

export const getAcademicTerms = AsyncHandler(async (req, res) => {
	const academicTerms = await AcademicTerm.find({}).sort({
		createdAt: 1,
	});
	res.status(200).json(
		new ApiResponse(
			200,
			academicTerms,
			'Academic terms fetched successfully'
		)
	);
});

//* @ desc Get academic term by id
//* @ route GET /api/v1/academics/academic-term/:id
//* @ access Private

export const getAcademicTermById = AsyncHandler(async (req, res) => {
	const academicTerm = await AcademicTerm.findById({
		_id: req.params.id,
	});

	if (!academicTerm) {
		throw new ApiError(404, 'Academic term not found');
	}

	res.status(200).json(
		new ApiResponse(
			200,
			academicTerm,
			'Academic term fetched successfully'
		)
	);
});

//* @ desc Update academic term by id
//* @ route PUT /api/v1/academics/academic-term/:id
//* @ access Private

export const updateAcademicTerm = AsyncHandler(async (req, res) => {
	const { name, description } = updateAcademicTermSchema.parse(
		req.body
	);
	const updatedBy = req.user._id;

	const academicTermExist = await AcademicTerm.findById(
		req.params.id
	);
	if (!academicTermExist) {
		throw new ApiError(404, 'Academic term not found');
	}

	const academicTerm = await AcademicTerm.findOne({ name });
	if (academicTerm) {
		throw new ApiError(400, 'Academic term already exist');
	}

	const academicTermUpdated = await AcademicTerm.findByIdAndUpdate(
		req.params.id,
		{
			name,
			description,
			updatedBy,
		},
		{ new: true }
	);

	if (!academicTermUpdated) {
		throw new ApiError(404, 'Academic term not found');
	}

	res.status(200).json(
		new ApiResponse(
			200,
			academicTermUpdated,
			'Academic term updated successfully'
		)
	);
});

//* @ desc Delete academic term by id
//* @ route DELETE /api/v1/academics/academic-term/:id
//* @ access Private

export const deleteAcademicTerm = AsyncHandler(async (req, res) => {
	const id = req.params.id;
	const academicTerm = await AcademicTerm.findByIdAndDelete(
		id
	).select('name -_id');

	if (!academicTerm) {
		throw new ApiError(404, 'Academic term not found');
	}

	res.status(200).json(
		new ApiResponse(
			200,
			academicTerm,
			'Academic term deleted successfully'
		)
	);
});
