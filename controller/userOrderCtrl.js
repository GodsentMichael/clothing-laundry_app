const Order = require('../models/userOrderModel');
const User = require('../models/userModel');
const Cart = require('../models/cartModel');
const Clothing = require('../models/clothingModel');
const asyncHandler = require('express-async-handler');
const { validateMongoDbId } = require('../utils/validateMongoId');
const uniqid = require('uniqid');

//To create a new order
const createOrder = asyncHandler(async (req, res) => {
	const { COD, promocodeApplied } = req.body;
	const { _id } = req.user;
	validateMongoDbId(_id);
	try {
		if (!COD) throw new Error('Create cash order failed');
		const user = await User.findById(_id).exec();
		let userCart = await Cart.findOne({ orderedBy: user._id }).exec();
		let finalAmount = 0;
		if (promocodeApplied && userCart.totalAfterDiscount) {
			finalAmount = userCart.totalAfterDiscount; // * 100;
		} else {
			finalAmount = userCart.cartTotal; //* 100;
		}

		let newOrder = await new Order({
			clothings: userCart.clothings,
			paymentIntent: {
				id: uniqid(),
				method: 'COD',
				amount: finalAmount,
				currency: 'NGN',
				status: 'Cash On Delivery',
				created: Date.now(),
			},
			orderStatus: 'Cash On Delivery',
			orderedBy: user._id,
		}).save();
		// so now we decrement quantity and increment the sold field
		let updateOrder = userCart.clothings.map((item) => {
			return {
				updateOne: {
					filter: { _id: item.clothing._id },
					update: { $inc: { quantity: -item.count, sold: +item.count } },
				},
			};
		});
		let updatedOrder = await Clothing.bulkWrite(updateOrder, {});
		res.json({ message: 'success', updateOrder: updatedOrder });
	} catch (error) {
		throw new Error(error);
	}
});

//To get all orders
const getAllOrders = asyncHandler(async (req, res) => {
	// const { _id } = req.user;
	// validateMongoDbId(_id);
	try {
		const userOrders = await Order.find({})
			.populate('clothings.clothing')
			.populate('orderedBy', '_id name')
			.exec();
		res.json({ userOrders });
	} catch (error) {
		throw new Error(error);
	}
});

//To get a single order
const getSingleOrder = asyncHandler(async (req, res) => {
	const { _id } = req.user;
	const { id } = req.params;
	validateMongoDbId(_id);
	validateMongoDbId(id);
	try {
		const userOrder = await Order.findOne({ orderedBy: req.user._id })
			.populate('orderedBy', '_id name')
			.exec();
		res.json({ userOrder });
	} catch (error) {
		throw new Error(error);
	}
});

// To update an order status
const updateOrderStatus = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const { status } = req.body;
	validateMongoDbId(id);
	try {
		const updateOrder = await Order.findByIdAndUpdate(
			id,
			{
				orderStatus: status,
				paymentIntent: {
					status: status,
				},
			},
			{ new: true }
		).exec();
		res.json({ updateOrder });
	} catch (error) {
		throw new Error(error);
	}
});

module.exports = {
	createOrder,
	getAllOrders,
	getSingleOrder,
	updateOrderStatus,
};
