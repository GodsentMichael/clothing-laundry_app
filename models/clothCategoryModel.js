const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;

const clothCategorySchema = new mongoose.Schema(
	{
		title: { type: String, required: true, unique: true, index: true },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('ClothCategory', clothCategorySchema);
