import AsyncHandler from 'express-async-handler';
import Admin from '../../model/Staff/Admin.model.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import Program from '../../model/Academic/Program.model.js';
import ApiError from '../../utils/ApiError.js';
import {
	createProgramSchema,
	updateProgramSchema,
} from '../../schemas/program.schema.js';

//* @ desc Create a new Program
//* @ route POST /api/v1/academics/programs
//* @ access Private

export const createProgram = AsyncHandler(async (req, res) => {
	const { name, description, code, duration } =
		createProgramSchema.parse(req.body);
	const createdBy = req?.user?._id;

	const programExist = await Program.findOne({ name });

	if (programExist) {
		throw new ApiError(400, 'Program already exist');
	}

	const createdProgram = await Program.create({
		name,
		description,
		createdBy,
		code,
		duration,
	});

	if (!createdProgram) {
		throw new ApiError(
			400,
			'Something went wrong while creating the Program'
		);
	}

	// push the Program to the user
	const admin = await Admin.findById(req.user._id);
	admin.programs.push(createdProgram._id);
	await admin.save();

	res.status(201).json(
		new ApiResponse(
			201,
			createdProgram,
			'Program created successfully'
		)
	);
});

//* @ desc Get all Programs
//* @ route GET /api/v1/academics/programs
//* @ access Private

export const getPrograms = AsyncHandler(async (req, res) => {
	const programs = await Program.find({}).sort({
		createdAt: 1,
	});
	res.status(200).json(
		new ApiResponse(200, 'Programs fetched successfully', programs)
	);
});

//* @ desc Get class level by id
//* @ route GET /api/v1/academics/class-level/:id
//* @ access Private

export const getProgramById = AsyncHandler(async (req, res) => {
	const fetchedProgram = await Program.findById({
		_id: req.params.id,
	});

	if (!fetchedProgram) {
		throw new ApiError(404, 'Program not found');
	}

	res.status(200).json(
		new ApiResponse(
			200,
			'Program fetched successfully',
			fetchedProgram
		)
	);
});

//* @ desc Update class level by id
//* @ route PUT /api/v1/academics/class-level/:id
//* @ access Private

export const updateProgram = AsyncHandler(async (req, res) => {
	const { name, description } = updateProgramSchema.parse(req.body);

	const program = await Program.findById(req.params.id);

	if (!program) {
		throw new ApiError(404, 'Program not found');
	}

	const fetchedProgram = await Program.findOne({ name });

	if (fetchedProgram) {
		throw new ApiError(400, 'Program already exist');
	}

	const updatedProgram = await Program.findByIdAndUpdate(
		req.params.id,
		{ name, description },
		{ new: true }
	);

	if (!updatedProgram) {
		throw new ApiError(404, 'Program not found');
	}

	res.status(200).json(
		new ApiResponse(
			200,
			'Program updated successfully',
			updatedProgram
		)
	);
});

//* @ desc Delete class level by id
// * @ route DELETE /api/v1/academics/class-level/:id
// * @ access Private

export const deleteProgram = AsyncHandler(async (req, res) => {
	const { id } = req.params;
	const fetchedProgram = await Program.findByIdAndDelete(id);

	if (!fetchedProgram) {
		throw new ApiError(404, 'Program not found');
	}

	res.status(200).json(
		new ApiResponse(
			200,
			'Program deleted successfully',
			fetchedProgram
		)
	);
});
