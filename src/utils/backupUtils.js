import mongoose from 'mongoose';
import Backup from '../model/BackUp/backUp.js';
import ApiError from './ApiError.js';

// Function to backup and delete a document
export const backupAndDelete = async (
	model, // complete model object nai patauna paryo
	documentId,
	originalDocument,
	deletemessage
) => {
	try {
		let documentToDelete = originalDocument;
		if (!documentToDelete) {
			documentToDelete = await model.findById(documentId);
			if (!documentToDelete) {
				throw new ApiError(400, 'Document not found');
			}
		}

		// Create a backup of the document
		const backup = new Backup({
			originalCollection: model.modelName,
			originalId: documentToDelete._id,
			data: documentToDelete.toObject(),
		});

		await backup.save();

		// Delete the document
		if (!originalDocument) {
			await model.findByIdAndDelete(documentId);
		} else {
			await documentToDelete.deleteOne();
		}

		return documentToDelete;
	} catch (error) {
		throw new ApiError(
			500,
			deletemessage || 'Error while deleting , please try again'
		);
	}
};

// Function to restore a document from the backup
export const restoreFromBackup = async (backupId) => {
	try {
		const backup = await Backup.findById(backupId);

		if (!backup) {
			throw new ApiError(404, 'Backup not found');
		}

		// Load the correct model based on the backup's collection name
		const model = mongoose.model(backup.originalCollection);
		if (!model) {
			throw new ApiError(500, 'Model not found');
		}

		const restoredDocument = new model(backup.data);
		await restoredDocument.save();

		// Delete the backup after successful restoration
		await Backup.findByIdAndDelete(backupId);

		return restoredDocument;
	} catch (error) {
		throw new ApiError(500, 'Error while restoring');
	}
};
