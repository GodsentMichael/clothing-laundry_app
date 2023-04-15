const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;

const laundryOrderSchema = new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	orderDate: { type: Date, default: Date.now, required: true },
	deliveryDate: { type: Date, required: true },
	washType: {
		type: String,
		enum: [
			'wash and starch',
			'wash, starch and iron',
			'wash and dye',
			'dry clean',
		],
		required: true,
	},
	items: [
		{
			clothing: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Clothing',
				required: true,
			},
			quantity: { type: Number, required: true },
		},
	],
	slug: {
		type: String,
		required: true,
		// unique: true,
		lowercase: true,
	},
	modeOfPackaging: {
		type: String,
		enum: ['folded', 'hangar', 'none'],
		default: 'none',
	},
	status: {
		type: String,
		enum: ['pending', 'in progress', 'ready for delivery', 'delivered'],
		default: 'pending',
	},
	modeOfDelivery: {
		type: String,
		enum: ['pickup', 'delivery'],
		default: 'pickup',
	},
	numViews: {
		type: Number,
		default: 0,
	},
	price: { type: Number, required: true },
	payment: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Payment',
		required: true,
	},
	images: [],
	
},
{ timestamps: true},
);

module.exports = mongoose.model('LaundryOrder', laundryOrderSchema);
