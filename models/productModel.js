const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;

// Declaring the Schema of the product model
const productSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
		},
		slug: {
			type: String,
			required: true,
			lowercase: true,
			unique: true,
		},
		description: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		category: {
			type: mongoose.Schema.types.ObjectId,
			ref: 'Category',
			required: true,
		},
		brand: {
			type: String,
			enum: ['Apple', 'Samsung', 'Microsoft', 'Lenovo', 'Asus'],
		},
		quantity: Number,
		sold: {
			type: Number,
			default: 0,
		},
		images: {
			type: Array,
		},
		color: {
			type: String,
			enum: ['Black', 'Red', 'Brown'],
		},
		ratings: [
			{
				star: Number,
				postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
			},
		],
	},
	{ timestamps: true }
);

//Export the model
module.exports = mongoose.model('Products', userSchema);
