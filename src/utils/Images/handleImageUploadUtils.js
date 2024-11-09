import ApiError from '../ApiError.js';
import {
	deleteFromCloudinary,
	uploadOnCloudinary,
} from './cloudinary.js';
import removeMulterUploadFiles from './removeMulterUploadFiles.js';

async function handleImageUpload(
	avatarLocalPath,
	currentImage,
	__imageDir,
	next
) {
	if (!avatarLocalPath) return currentImage;

	const uploadedImage = await uploadOnCloudinary(
		avatarLocalPath,
		__imageDir
	);
	if (!uploadedImage?.url) {
		removeMulterUploadFiles(avatarLocalPath);
		throw new ApiError(500, 'Error uploading image');
	}

	// Delete the previous image if a new one is uploaded while updating
	if (currentImage) {
		await deleteFromCloudinary(
			currentImage.split('/').pop().split('.')[0]
		);
	}

	return uploadedImage.url;
}

export default handleImageUpload;
