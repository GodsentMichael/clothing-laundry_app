const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;

const paymentSchema = new mongoose.Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
		laundryOrder: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'LaundryOrder',
			required: true,
		},
		amount: { type: Number, required: true },
		paymentMethod: {
			type: String,
			enum: ['cash payment', 'POS', 'bank transfer'],
			default: 'cash payment',
			required: true,
		},
		status: {
			type: String,
			enum: ['pending', 'completed', 'failed'],
			default: 'pending',
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
