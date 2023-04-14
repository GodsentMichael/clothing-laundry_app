const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;

const laundryCategorySchema = new mongoose.Schema(
	{
		title: { type: String, required: true, unique: true, index: true },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('LaundryCategory', laundryCategorySchema);
