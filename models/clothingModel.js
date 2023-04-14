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
		numViews: {
			type: Number,
			default: 0,
		},
		isLiked: {
			type: Boolean,
			default: false,
		},
		isDisliked: {
			type: Boolean,
			default: false,
		},
		likes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
		],
		dislikes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
		],
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		ratings: [
			{
				star: Number,
				comment: String,
				postedby: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
			},
		],
		totalRating: {
			type: String,
			default: 0,
			// select: false,
		},
		images: [],
	},
	{
		toJSON: {
			virtuals: true,
		},
		toObject: {
			virtuals: true,
		},
		timestamps: true,
	}
);

module.exports = mongoose.model('Clothing', clothingSchema);
