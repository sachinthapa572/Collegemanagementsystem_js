import { fileTypeFromStream } from 'file-type';
import { environmentVariables } from '../constant.js';
import { ApiResponse } from './ApiResponse';
import { safeUnlinkSync } from './fileUtils.js';
import fs from 'fs';

export async function fileTypeCheck(req) {
	try {
		const BASE_UPLOAD_DIR = path.resolve(
			__dirname,
			'../public/temp'
		);
		const filePath = path.resolve(req.file.path);

		// Prevent Path Traversal by ensuring the file is within the allowed directory
		if (!filePath.startsWith(BASE_UPLOAD_DIR)) {
			safeUnlinkSync(req.file.path); // Delete the potentially malicious file
			return res
				.status(400)
				.json(
					new ApiResponse(
						400,
						'Invalid file content. File must be an image.'
					)
				);
		}

		const fileStream = fs.createReadStream(req.file.path);
		const detectedType = await fileTypeFromStream(fileStream);

		if (
			!detectedType ||
			!environmentVariables.allowedTypesFileTypes.includes(
				detectedType.mime
			)
		) {
			// If the content type is not valid, you can delete the file
			safeUnlinkSync(req.file.path);
			// fs.unlinkSync(req.file.path);
			return res.status(415).json({
				message: 'Invalid file content. File must be an image.',
			});
		}
	} catch (error) {
		console.error('Error during file type check:', error);
		return res
			.status(500)
			.json(new ApiResponse(500, 'Error processing file.'));
	}
}
