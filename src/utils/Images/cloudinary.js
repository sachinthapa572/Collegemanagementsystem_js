import { v2 as cloudinary } from 'cloudinary';
import { environmentVariables } from '../../constant.js';
import ApiError from '../ApiError.js';
import { safeUnlinkSync } from '../fileUtils.js';

// Configuration
cloudinary.config({
	cloud_name: environmentVariables.CLOUDINARY_NAME,
	api_key: environmentVariables.CLOUDINARY_API_KEY,
	api_secret: environmentVariables.CLOUDINARY_API_SECRET,
	secure: true,
});

const uploadOnCloudinary = async (filePath, folder) => {
	try {
		if (!filePath) {
			throw new ApiError(400, 'Invalid file path');
		}
		const result = await cloudinary.uploader.upload(filePath, {
			resource_type: 'auto',
			asset_folder: `SchoolManagementApp/${folder}`,
		});
		console.log('File Upload Successful', result.url);
		safeUnlinkSync(filePath);
		return result;
	} catch (error) {
		console.error('cloudinary Upload Error !! ', error);
		if (filePath) {
			safeUnlinkSync(filePath);
		}
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
