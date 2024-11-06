import { model, Schema } from 'mongoose';

// Generic Backup Schema
const backupSchema = new Schema({
	originalCollection: { type: String, required: true }, // Store the model name
	originalId: { type: Schema.Types.ObjectId, required: true }, // Store the original document ID
	data: { type: Schema.Types.Mixed, required: true }, // Store the document data
	deletedAt: { type: Date, default: Date.now }, // When the document was backed up
});

// Index to delete backups after 3 days
backupSchema.index({ deletedAt: 1 }, { expireAfterSeconds: 259200 });

const Backup = model('Backup', backupSchema);
export default Backup;
