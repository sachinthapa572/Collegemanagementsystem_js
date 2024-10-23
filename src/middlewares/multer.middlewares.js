import multer from 'multer';
import ApiError from '../utils/ApiError.js';
import { v4 as uuidv4 } from 'uuid';
import { allowedTypesFileTypes } from '../constant.js';

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './public/temp/');
	},
	filename: function (req, file, cb) {
		// Ensure file name does not contain invalid or malicious characters
		const safeFilename = file.originalname.replace(
			/[^a-zA-Z0-9.-]/g,
			'_'
		);
		// cb(null, uuidv4() + '-' + safeFilename);
		const uniqueSuffix = uuidv4();
		const fileExtension = file.originalname.split('.').pop();
		cb(null, `${uniqueSuffix}-${safeFilename}.${fileExtension}`);
	},
});

async function fileFilter(req, file, cb) {
	try {
		const mimeType = file.mimetype;

		// Validate MIME type
		if (!allowedTypesFileTypes.includes(mimeType)) {
			return cb(
				new ApiError(
					415,
					'Invalid file type. Only JPG, PNG files are allowed.'
				)
			);
		}
		cb(null, true);
	} catch (error) {
		// Catch any error during the process and return it
		cb(new ApiError(500, 'Error processing file.'));
	}
}

// Multer middleware for file upload
const uploadFileMulter = multer({
	storage: storage,
	fileFilter: fileFilter,
	limits: {
		fileSize: 1024 * 1024 * 2, // 2 MB file size limit
	},
});

export { uploadFileMulter };
