const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;

const clothingSchema = new mongoose.Schema(
	{
		fabricType: { type: String, required: true },
		category: { type: String, required: true },
		color: { type: String, required: true },
		size: { type: String, required: true },
		careInstructions: { type: String, required: true },
		slug: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
		},
		sold: {
			type: Number,
			default: 0,
			select: false,
		},
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Clothing', clothingSchema);
