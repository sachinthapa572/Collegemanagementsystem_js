import mongoose, { model, Schema } from 'mongoose';

const counterSchema = new Schema({
	// the _id is the static field
	_id: { type: String, required: true },
	seq: { type: Number, default: 0 },
});

const Counter = model('Counter', counterSchema);
export default Counter;
