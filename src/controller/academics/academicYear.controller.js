import AsyncHandler from 'express-async-handler';
import AcademicYear from '../../model/Academic/AcademicYear.model.js';
import ApiError from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import Admin from '../../model/Staff/Admin.model.js';
import {
	createAcademicYearSchema,
	updateAcademicYearSchema,
} from '../../schemas/academicYear.schema.js';

//*	@ desc Create a new academic year
//*	@ route POST /api/v1/academics/academic-year
//*	@ access Private

export const createAcademicYear = AsyncHandler(async (req, res) => {
	const { name, fromYear, toYear } = createAcademicYearSchema.parse(
		req.body
	);
	const createdBy = req.user._id;

	const academicYear = await AcademicYear.findOne({ name });

	if (academicYear) {
		throw new ApiError(400, 'Academic year already exist');
	}

	const academicYearCreated = await AcademicYear.create({
		name,
		fromYear,
		toYear,
		createdBy,
	});

	// push the academic year to the user
	const admin = await Admin.findById(req.user._id);
	admin.academicYears.push(academicYearCreated._id);

	await admin.save();

	res.status(201).json(
		new ApiResponse(
			'Academic year created successfully',
			academicYearCreated
		)
	);
});

//*	@ desc Get all academic years
//*	@ route GET /api/v1/academics/academic-year
//*	@ access Private

export const getAcademicYears = AsyncHandler(async (req, res) => {
	const academicYears = await AcademicYear.find({}).sort({
		createdAt: 1,
	});
	res.status(200).json(
		new ApiResponse(
			'Academic years fetched successfully',
			academicYears
		)
	);
});

//* @ desc Get academic year by id
//* @ route GET /api/v1/academics/academic-year/:id
//* @ access Private

export const getAcademicYearById = AsyncHandler(async (req, res) => {
	const academicYear = await AcademicYear.findById({
		_id: req.params.id,
	});

	if (!academicYear) {
		throw new ApiError(404, 'Academic year not found');
	}

	res.status(200).json(
		new ApiResponse(
			'Academic year fetched successfully',
			academicYear
		)
	);
});

//* @ desc Update academic year by id
//* @ route PUT /api/v1/academics/academic-year/:id
//* @ access Private

export const updateAcademicYear = AsyncHandler(async (req, res) => {
	const { name, fromYear, toYear } = updateAcademicYearSchema.parse(
		req.body
	);
	const updatedBy = req.user._id;
	const AcademicYearExist = await AcademicYear.findById(
		req.params.id
	);
	if (!AcademicYearExist) {
		throw new ApiError(404, 'Academic year not found');
	}

	const academicYear = await AcademicYear.findOne({ name });

	if (academicYear) {
		throw new ApiError(400, 'Academic year already exist');
	}

	const academicYearUpdated = await AcademicYear.findByIdAndUpdate(
		req.params.id,
		{
			name,
			fromYear,
			toYear,
			updatedBy,
		},
		{ new: true }
	);

	if (!academicYearUpdated) {
		throw new ApiError(401, 'Failed to update Academic year');
	}

	res.status(200).json(
		new ApiResponse(
			'Academic year updated successfully',
			academicYearUpdated
		)
	);
});

//* @ desc Delete academic year by id
//* @ route DELETE /api/v1/academics/academic-year/:id
//* @ access Private

export const deleteAcademicYear = AsyncHandler(async (req, res) => {
	const academicYear = await AcademicYear.findByIdAndDelete(
		req.params.id
	).select('name -_id');

	if (!academicYear) {
		throw new ApiError(404, 'Academic year not found');
	}

	res.status(200).json(
		new ApiResponse(
			200,
			academicYear,
			'Academic year deleted successfully'
		)
	);
});
