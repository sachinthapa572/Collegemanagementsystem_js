import AsyncHandler from 'express-async-handler';
import Admin from '../../model/Staff/Admin.model.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import ClassLevel from '../../model/Academic/ClassLevel.model.js';
import ApiError from '../../utils/ApiError.js';
import { createClassLevelSchema, updateClassLevelSchema } from '../../schemas/classLevel.schema.js';

//* @ desc Create a new class level
//* @ route POST /api/v1/academics/class-level
//* @ access Private

export const createClassLevel = AsyncHandler(async (req, res) => {
	const { name, description } = createClassLevelSchema.parse(
		req.body
	);
	const createdBy = req?.user?._id;

	const classLevel = await ClassLevel.findOne({ name });

	if (classLevel) {
		throw new ApiError(400, 'Class level already exist');
	}

	const classLevelCreated = await ClassLevel.create({
		name: name,
		description,
		createdBy,
	});

	if (!classLevelCreated) {
		throw new ApiError(
			400,
			'Something went wrong while creating the class level'
		);
	}

	// push the class level to the user
	const admin = await Admin.findById(req.user._id);
	admin.classLevels.push(classLevelCreated._id);
	await admin.save();

	res.status(201).json(
		new ApiResponse(
			201,
			classLevelCreated,
			'Class level created successfully'
		)
	);
});

//* @ desc Get all class levels
//* @ route GET /api/v1/academics/class-level
//* @ access Private

export const getClassLevels = AsyncHandler(async (req, res) => {
	const classLevels = await ClassLevel.find({}).sort({
		createdAt: 1,
	});
	res.status(200).json(
		new ApiResponse(
			200,
			'Class levels fetched successfully',
			classLevels
		)
	);
});

//* @ desc Get class level by id
//* @ route GET /api/v1/academics/class-level/:id
//* @ access Private

export const getClassLevelById = AsyncHandler(async (req, res) => {
	const { id } = req.params;
	const classLevel = await ClassLevel.findById(id);

	if (!classLevel) {
		throw new ApiError(404, 'Class level not found');
	}

	res.status(200).json(
		new ApiResponse(
			200,
			'Class level fetched successfully',
			classLevel
		)
	);
});

//* @ desc Update class level by id
//* @ route PUT /api/v1/academics/class-level/:id
//* @ access Private

export const updateClassLevel = AsyncHandler(async (req, res) => {
	const { name, description } = updateClassLevelSchema.parse(
		req.body
	);

	const classLevelExist = await ClassLevel.findById(req.params.id);

	if (!classLevelExist) {
		throw new ApiError(404, 'Class level not found');
	}

	const classLevel = await ClassLevel.findOne({ name });

	if (classLevel) {
		throw new ApiError(400, 'Class level already exist');
	}

	const updatedClassLevel = await ClassLevel.findByIdAndUpdate(
		req.params.id,
		{ name, description },
		{ new: true }
	);

	if (!updatedClassLevel) {
		throw new ApiError(404, 'Class level not found');
	}

	res.status(200).json(
		new ApiResponse(
			200,
			'Class level updated successfully',
			updatedClassLevel
		)
	);
});

//* @ desc Delete class level by id
// * @ route DELETE /api/v1/academics/class-level/:id
// * @ access Private

export const deleteClassLevel = AsyncHandler(async (req, res) => {
	const { id } = req.params;
	const classLevel = await ClassLevel.findByIdAndDelete(id);

	if (!classLevel) {
		throw new ApiError(404, 'Class level not found');
	}

	res.status(200).json(
		new ApiResponse(
			200,
			'Class level deleted successfully',
			classLevel
		)
	);
});
