const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const Clothing = require('../models/clothingModel');
const path = require('path');
const cloudinaryUploadImg = require('../utils/cloudinary');
const { validateMongoDbId } = require('../utils/validateMongoId');
const fs = require("fs");
const dotenv = require('dotenv').config();

// To create Fabrics Order.
const createClothOrder = asyncHandler(async (req, res) => {
	try {
		if (req.body.fabricType) {
			req.body.slug = slugify(req.body.fabricType);
		}
		const newClothOrder = await Clothing.create(req.body);
		if (newClothOrder) {
			res.json({
				newClothOrder,
				message: 'Cloth order successfully created',
			});
		} else {
			throw new Error('Invalid clothOrder data, check your inputs!');
		}
	} catch (error) {
		throw new Error(error);
	}
});

// To Get Fabrics Orders.
const getAllClothOrders = asyncHandler(async (req, res) => {
	try {
		const allClothOrders = await Clothing.find({});
		if (allClothOrders) {
			res.json({
				allClothOrders,
				message: 'All cloth orders successfully retrieved',
			});
		} else {
			throw new Error('No cloth orders found');
		}
	} catch (error) {
		throw new Error(error);
	}
});

// To Get A Fabric Order.
const getAClothOrder = asyncHandler(async (req, res) => {
	const { id } = req.params;
	validateMongoDbId(id);
	try {
		const clothOrder = await Clothing.findById(id)
			.populate({
				path: 'owner',
				select: 'email m obile',
			})
			.populate('likes')
			.populate('dislikes');

		//   console.log('ClothOrder =>', clothOrder);
		const updateViews = await Clothing.findByIdAndUpdate(
			id,
			{
				$inc: { numViews: 1 },
			},
			{ new: true }
		);
		if (clothOrder && updateViews) {
			res.json({
				clothOrder,
				message: 'Cloth order successfully retrieved',
			});
		} else {
			throw new Error('No cloth order found');
		}
	} catch (error) {
		throw new Error(error);
	}
});

// To Update Fabric Order.
const updateClothOrder = asyncHandler(async (req, res) => {
	const { id } = req.params;
	// console.log(req.params);
	try {
		const updatedFabricOrder = await Clothing.findOneAndUpdate(id, req.body, {
			new: true,
		});
		if (updatedFabricOrder) {
			res.json({
				updatedFabricOrder,
				message: 'Cloth order successfully updated',
			});
		} else {
			throw new Error('No cloth order found');
		}
	} catch (error) {
		throw new Error(error);
	}
});

// To delete/cancel Fabric Order.
const deleteClothOrder = asyncHandler(async (req, res) => {
	const { id } = req.params;
	try {
		const deletedClothOrder = await Clothing.findByIdAndDelete(id);
		if (deletedClothOrder) {
			res.json({
				deletedClothOrder,
				message: 'Cloth order successfully deleted',
			});
		} else {
			throw new Error('No cloth order found');
		}
	} catch (error) {
		throw new Error(error);
	}
});

const likeClothing = asyncHandler(async (req, res) => {
	const { clothId } = req.body;
	// console.log(clothId)
	validateMongoDbId(clothId);
	try {
		// Find the particular cloth you want to like
		const cloth = await Clothing.findById(clothId);
		// Find the logged in user that wants to like cloth.
		const loggedInUserId = req?.user?._id;
		// Now find if the user has liked the cloth.
		// const isLiked = blog?.isLiked(loggedInUserId);
		const isLiked = cloth?.isLiked;
		// Find if the user has disliked the cloth earlier/already.
		const alreadyDisliked = cloth?.dislikes?.find(
			(userId) => userId?.toString() === loggedInUserId?.toString()
		);
		// If he has disliked, then we need to remove the dislike and add a like.
		if (alreadyDisliked) {
			const cloth = await Clothing.findByIdAndUpdate(
				clothId,
				{
					$pull: { dislikes: loggedInUserId },
					isDisliked: false,
				},
				{ new: true }
			);
			res.json({ message: 'Dislike removed', cloth });
		}
		// But if user has liked the cloth, then we need to remove the like.
		else if (isLiked) {
			const cloth = await Clothing.findByIdAndUpdate(
				clothId,
				{
					$pull: { likes: loggedInUserId },
					isLiked: false,
				},
				{ new: true }
			);
			res.json({ message: 'Like removed', cloth });
		}
		// If user has not liked the cloth, then we need to add a like.
		else {
			const cloth = await Clothing.findByIdAndUpdate(
				clothId,
				{
					$push: { likes: loggedInUserId },
					isLiked: true,
				},
				{ new: true }
			);
			res.json({ message: 'Like added', cloth });
		}
	} catch (error) {
		throw new Error(error);
	}
});

const dislikeClothing = asyncHandler(async (req, res) => {
	const { clothId } = req.body;
	validateMongoDbId(clothId);
	try {
		// Find the particular cloth you want to like
		const cloth = await Clothing.findById(clothId);
		// Find the logged in user that wants to like cloth.
		const loggedInUserId = req?.user?._id;
		// Now find if the user has liked the cloth.
		const isDisliked = cloth?.isDisliked;
		// Find if the user has disliked the cloth earlier/already.
		const alreadyLiked = cloth?.likes?.find(
			(userId) => userId?.toString() === loggedInUserId?.toString()
		);
		// If he has liked, then we need to remove the like and add a dislike.
		if (alreadyLiked) {
			const cloth = await Clothing.findByIdAndUpdate(
				clothId,
				{
					$pull: { likes: loggedInUserId },
					isLiked: false,
				},
				{ new: true }
			);
			res.json({ message: 'Like removed', cloth });
		} else if (isDisliked) {
			const cloth = await Clothing.findByIdAndUpdate(
				clothId,
				{
					$pull: { dislikes: loggedInUserId },
					isDisliked: false,
				},
				{ new: true }
			);
			res.json({ message: 'Dislike removed', cloth });
		} else {
			const cloth = await Clothing.findByIdAndUpdate(
				clothId,
				{
					$push: { dislikes: loggedInUserId },
					isDisliked: true,
				},
				{ new: true }
			);
			res.json({ message: 'Dislike added', cloth });
		}
	} catch (error) {
		throw new Error(error);
	}
});

// To add a fabric user likes to wishlist
const addToWishlist = asyncHandler(async (req, res) => {
	const { _id } = req.user;
	const { clothId } = req.body;
	validateMongoDbId(clothId, _id);
	try {
		// Find the particular user who wants to add to wishlist.
		const user = await User.findById(_id);
		// Check if user has already added cloth to wishlist
		const isAlreadyAdded = user?.wishlist?.find(
			(id) => id.toString() === clothId
		);
		if (isAlreadyAdded) {
			let user = await User.findByIdAndUpdate(
				_id,
				{
					$pull: { wishlist: clothId },
				},
				{ new: true }
			);
			res.json({ message: 'Removed from wishlist', user });
		} else {
			let user = await User.findByIdAndUpdate(
				_id,
				{
					$push: { wishlist: clothId },
				},
				{ new: true }
			);
			res.json({ message: 'Added to wishlist', user });
		}
	} catch (error) {
		throw new Error(error);
	}
});

// To implement rating functionality
const ratingHandler = asyncHandler(async (req, res) => {
	const { _id } = req.user;
	const { clothId, star, comment } = req.body;
	// console.log(comment)
	validateMongoDbId(clothId);
	try {
		//First find the cloth the user wants to rate.
		const cloth = await Clothing.findById(clothId);
		// Check if the user has already rated the cloth.
		let alreadyRated = cloth.ratings.find(
			(userId) => userId.postedby.toString() === _id.toString()
		);
		if (alreadyRated) {
			// If user has already rated the cloth, then we need to update the rating.
			const updatedRating = await Clothing.updateOne(
				{ ratings: { $elemMatch: alreadyRated } },
				{
					$set: { "ratings.$.star": star, "ratings.$.comment": comment },
				  },
				{ new: true },
			);
			//  res.json({message: 'Rating updated', updatedRating})
		} else {
			const rateCloth = await Clothing.findByIdAndUpdate(
				clothId,
				{
					$push: { ratings: {  star: star, comment: comment, postedby: _id, } },
				},
				{ new: true }
			);
			// res.json({ message: 'Rating added', rateCloth });
		}
		// For the total rating
		// const totalRating = await Clothing.aggregate([
		const getAllRatings = await Clothing.findById(clothId);
		// Initialize the totalRating variable to 1, so that we don't get NaN.//
		// Initialize the totalRaating variable to the total number of ratings.
		// This would help us get the avaerage later on.
		// let totalRating = 1
		let totalRating = getAllRatings.ratings.length;
		let ratingSum = getAllRatings.ratings
			.map((item) => item.star)
			.reduce((prev, curr) => prev + curr, 0);
		let actualRating = Math.round(ratingSum / totalRating);
		let finalClothRating = await Clothing.findByIdAndUpdate(
			clothId,
			{
				totalRating: actualRating,
			},
			{ new: true }
		);
		res.json(finalClothRating);
		
		// res.json({ message: 'Rating added', rateCloth });
		//  let totalRating = 0;
		//  getAllRatings.ratings.forEach((rating) => {
		// 	 totalRating += rating.star
		//  }
		//  )
		//  const averageRating = totalRating / getAllRatings.ratings.length;
		//  const updateAverageRating = await Clothing.findByIdAndUpdate(
		// 	 clothId,
		// 	 {
		// 		$set: { averageRating: averageRating },
		// 	  },
		// 	  { new: true }
		// 	 );
		// 	res.json({message: 'Average rating updated', updateAverageRating})
		
	} catch (error) {
		throw new Error(error);
	}
});

// To Upload Cloth Images

const uploadImages = asyncHandler(async (req, res) => {
	const {id} = req.params;
	try {
		const uploader = async (path) => await cloudinaryUploadImg(path, "images");
		const urls = [];
		const files = req.files;
		for (const file of files) {
			const {path} = file;
			const newPath = await uploader(path);
			urls.push(newPath);
			fs.unlinkSync(path)
		}
		const findCloth = await Clothing.findByIdAndUpdate(
			id,
			{
				images: urls.map((file) => {return file}),
			},
			{ new: true }
		);
		if (findCloth) {
			res.json({message: 'Images uploaded', findCloth});
		} else {
			res.status(400).json({message: 'Failed to upload images'});
		}	
	} catch (error) {
		console.error(error);
		res.status(500).json({message: 'Internal server error'});
	}
});


  

module.exports = {
	createClothOrder,
	getAllClothOrders,
	getAClothOrder,
	updateClothOrder,
	deleteClothOrder,
	likeClothing,
	dislikeClothing,
	addToWishlist,
	ratingHandler,
	uploadImages
};
