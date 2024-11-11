import { environmentVariables } from '../constant.js';
import { safeUnlinkSync } from './fileUtils.js';

export async function fileTypeCheck(req) {
	try {
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
		res.status(500).json({
			message: 'Error processing file.',
		});
	}
}
