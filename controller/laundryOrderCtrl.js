const LaundryOrder = require('../models/laundryOrderModel');
const AsyncHandler = require('express-async-handler');
const slugify = require('slugify');

//To create a laundry order.
const createLaundryOrder = AsyncHandler(async (req, res) => {
	try {
		// To create slugs from the wash type the user entered.
		if (req.body.washType) {
			req.body.slug = slugify(req.body.washType);
		}
		const newLaundryOrder = await LaundryOrder.create(req.body);
		if (newLaundryOrder) {
			res.json({
				_id: newLaundryOrder._id,
				user: newLaundryOrder.user,
				orderDate: newLaundryOrder.orderDate,
				deliveryDate: newLaundryOrder.deliveryDate,
				washType: newLaundryOrder.washType,
				slug: newLaundryOrder.slug,
				items: newLaundryOrder.items,
				modeOfPackaging: newLaundryOrder.modeOfPackaging,
				status: newLaundryOrder.status,
				modeOfDelivery: newLaundryOrder.modeOfDelivery,
				price: newLaundryOrder.price,
				payment: newLaundryOrder.payment,
			});
		} else {
			throw new Error('Invalid updatedLaundryOrder data, check your inputs!');
		}
	} catch (error) {
		throw new Error(error);
	}

	// OR
	// try {
	//     if (req.body.title) {
	//       req.body.slug = slugify(req.body.title);
	//     }
	//     const newLaundryOrder = await LaundryOrder.create(req.body);
	//     res.json(newLaundryOrder);
	//   } catch (error) {
	//     throw new Error(error);
	//   }
});

// To  Get a laundry Order
const getALaundryOrder = AsyncHandler(async (req, res) => {
	const { id } = req.params;
	// console.log(id);
	try {
		const updateViews = await LaundryOrder.findByIdAndUpdate(
			id,
			{
				$inc: { numViews: 1 },
			},
			{ new: true }
		);
		const updatedLaundryOrder = await LaundryOrder.findById(id);
		res.json(updatedLaundryOrder);
	} catch (error) {
		throw new Error(error);
	}
});

// To  Get all laundry Orders
const getAllLaundryOrders = AsyncHandler(async (req, res) => {
	try {
		// Filtering
		const queryObj = { ...req.query };
		const excludeFields = ['page', 'sort', 'limit', 'fields'];
		excludeFields.forEach((el) => delete queryObj[el]);
		console.log(queryObj);

		let queryStr = JSON.stringify(queryObj);
		queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
		console.log(JSON.parse(queryStr));
		let query = LaundryOrder.find(JSON.parse(queryStr));

		// Sorting
		if (req.query.sort) {
			const sortBy = req.query.sort.split(',').join(' ');
			query = query.sort(sortBy);
		} else {
			query = query.sort('-createdAt');
		}

		// Field Limiting
		if (req.query.fields) {
			const fields = req.query.fields.split(',').join(' ');
			query = query.select(fields);
		} else {
			query = query.select('-__v');
		}

		// Pagination
		const page = req.query.page * 1 || 1;
		const limit = req.query.limit * 1 || 10;
		const skip = (page - 1) * limit;
		query = query.skip(skip).limit(limit);

		if (req.query.page) {
			const numLaundryOrders = await LaundryOrder.countDocuments();
			if (skip >= numLaundryOrders) throw new Error('This page does not exist');
		}
		console.log(page, limit, skip);
		const results = await query;
		res.status(200).json({
			status: 'success',
			results: results.length,
			data: {
				results,
			},
		});
		//=> ONE WAY TO SORT & FILTER.
		// const allLaundryOrders = await LaundryOrder.find({
		//     status: req.query.status,
		//     modeOfDelivery: req.query.modeOfDelivery,
		// });
		//=> ANOTHER WAY TO SORT & FILTER.
		// const allLaundryOrders = await LaundryOrder.where('status', 'delivered').where('modeOfDelivery', 'delivery');
		// BETTER WAY
		// const allLaundryOrders = await LaundryOrder.find(queryObj);
		// if (allLaundryOrders) {
		// 	res.json(allLaundryOrders);
		// } else {
		// 	res.status(404);
		// 	throw new Error('No laundryOrders found!');
		// }
	} catch (error) {
		throw new Error(error);
	}
});

// To Update LaundryOrders
const updateLaundryOrder = AsyncHandler(async (req, res) => {
	const { id } = req.params;
	// console.log(id);
	try {
		if (req.body.washType) {
			req.body.slug = slugify(req.body.washType);
		}
		const updatedLaundryOrder = await LaundryOrder.findOneAndUpdate(
			id,
			req.body,
			{ new: true }
		);
		res.json(updatedLaundryOrder);
	} catch (error) {
		throw new Error(error);
	}
});

// To delete/cancel laundry order.
const deleteLaundryOrder = AsyncHandler(async (req, res) => {
	const { id } = req.params;
	try {
		const deletedLaundryOrder = await LaundryOrder.findByIdAndDelete(id);
		if (deletedLaundryOrder) {
			res.json({
				message: 'Laundry order successfully deleted',
			});
		} else {
			res.status(404);
			throw new Error('Laundry order not found!');
		}
	} catch (error) {
		throw new Error(error);
	}
});

module.exports = {
	createLaundryOrder,
	getALaundryOrder,
	getAllLaundryOrders,
	updateLaundryOrder,
	deleteLaundryOrder,
};
