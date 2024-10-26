import fs from 'fs/promises';
import path from 'path';

const removeMulterUploadFiles = async (files) => {
	if (!files) return;

	const fileArrays = Array.isArray(files) ? files : [files];

	for (const file of fileArrays) {
		try {
			const filePath = path.normalize(file);
			await fs.unlink(filePath);
			console.log(`File ${filePath} deleted successfully.`);
		} catch (err) {
			console.error(`Failed to delete file ${filePath}:`, err);
		}
	}
};

export default removeMulterUploadFiles;
