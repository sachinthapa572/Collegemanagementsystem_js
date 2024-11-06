import mongoose from 'mongoose';
import Backup from '../model/BackUp/backUp.js';
import ApiError from './ApiError.js';

// Function to back up and delete the document
export const backupAndDelete = async (
	model,
	documentId,
	originalDocument,
	deletemessage,
	next
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
			originalCollection: model.modelName, // Store the model name
			originalId: documentToDelete._id,
			data: documentToDelete.toObject(), // Store the document data
		});

		await backup.save();

		// Delete the document
		if (!originalDocument) {
			await model.findByIdAndDelete(documentId);
		} else {
			await documentToDelete.deleteOne();
		}
	} catch (error) {
		next(
			new ApiError(500, deletemessage || 'Error while deleting')
		);
	}
};

// Function to restore a document from the backup
export const restoreFromBackup = async (backupId, next) => {
	try {
		const backup = await Backup.findById(backupId);

		if (!backup) {
			next(new ApiError(404, 'Backup not found'));
		}

		// Load the correct model based on the backup's collection name
		const model = mongoose.model(backup.originalCollection);
		if (!model) {
			next(new ApiError(500, 'Model not found'));
		}

		const restoredDocument = new model(backup.data);

		await restoredDocument.save();

		await Backup.findByIdAndDelete(backupId);
		next();
	} catch (error) {
		next(new ApiError(500, 'Error while restoring'));
	}
};
