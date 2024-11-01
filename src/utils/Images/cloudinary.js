import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { environmentVariables } from '../../constant.js';

// Configuration
cloudinary.config({
	cloud_name: environmentVariables.CLOUDINARY_NAME,
	api_key: environmentVariables.CLOUDINARY_API_KEY,
	api_secret: environmentVariables.CLOUDINARY_API_SECRET,
	secure: true,
});

const uploadOnCloudinary = async (filePath, folder) => {
	try {
		if (!filePath) return;
		const result = await cloudinary.uploader.upload(filePath, {
			asset_folder: `SchoolManagementApp/${folder}`,
			resource_type: 'auto',
		});

		console.log('File Upload Successful', result.url);
		fs.unlinkSync(filePath);
		return result;
	} catch (error) {
		fs.unlinkSync(filePath);
		console.error('cloudinary Upload Error !! ', error);
		return null;
	}
};

const deleteFromCloudinary = async (publicId) => {
	try {
		const result = await cloudinary.uploader.destroy(publicId);
		console.log('File Delete Successful from cloudinary', result);
		return result;
	} catch (error) {
		console.error('cloudinary Delete Error !! ', error);
		return null;
	}
};
export { uploadOnCloudinary, deleteFromCloudinary };
