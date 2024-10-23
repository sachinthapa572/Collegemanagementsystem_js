import fs from 'fs';
import path from 'path';

const removeMulterUploadFiles = (files) => {
	if (!files) return;

	Object.values(files).forEach((fileArray) => {
		fileArray.forEach((file) => {
			const filePath = path.normalize(file.path); // Normalize file pat
			fs.unlink(filePath, (err) => {
				if (err) {
					console.error(
						`Failed to delete file ${filePath}:`,
						err
					);
				}
			});
		});
	});
};

export { removeMulterUploadFiles };
