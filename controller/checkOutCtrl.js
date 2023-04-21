const paystack = require('paystack')(process.env.PAYSTACK_PRIVATE_KEY);
const Cart = require('../models/cartModel');
const User = require('../models/userModel');
const Order = require('../models/userOrderModel');
const Clothing = require('../models/clothingModel');
const asyncHandler = require('express-async-handler');
const { validateMongoDbId } = require('../utils/validateMongoId');

const checkoutOrder = asyncHandler(async (req, res) => {
	const { _id } = req.user;
	validateMongoDbId(_id);
	const { cart, promocodeApplied } = req.body;
	try {
		const user = await User.findById(_id).exec();
		let userCart = await Cart.findOne({ orderedBy: user._id }).exec();

		let firstname = user.firstname;
		let lastname = user.lastname;
		let email = user.email;
		let finalAmount = 0;
		if (!promocodeApplied && typeof userCart.totalAfterDiscount === 'number') {
			finalAmount = userCart.totalAfterDiscount * 100;
		} else {
			finalAmount = userCart.cartTotal * 100;
		}
		console.log(finalAmount);

		const paymentData = {
			firstname: firstname,
			lastname: lastname,
			email: email,
			amount: finalAmount,
			metadata: {
				custom_fields: [
					{
						display_name: 'Total Cart Amount',
						variable_name: 'finalAmount',
						value: finalAmount,
					},
				],
			},
		};

		paystack.transaction.initialize(paymentData, async function (error, body) {
			if (error) {
				console.log(error);
			}
			res.json({
				message: 'Verification successful',
				authorization_url: body.data.authorization_url,
			});
			// console.log(body);
			const transactionReference = body.data.reference;
               // Empty user's cart after successful payment and order creation.
               await Cart.findByIdAndDelete(userCart._id);
			paystack.transaction.verify(transactionReference,async function (error, body) {
                if (error) {
                    console.log(error);
                    throw new Error(error);
                  }
                  console.log(body.message);
				//Now save the successful order to Database.
				const order = new Order({
					user: user._id,
					cartItems: userCart.clothings,
					transaction_id: body.data.reference,
                    orderStatus: "Completed",
					amount: body.data.amount / 100, // convert back to naira
					status: 'paid',
				});
				const savedOrder = await order.save();
            
			});
		});
	} catch (error) {
		throw new Error(error);
	}
});
module.exports = { checkoutOrder };
