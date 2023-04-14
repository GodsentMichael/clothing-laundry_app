const LaundryCategory = require('../models/laundryCategoryModel');
const {validateMongoDbId} = require('../utils/validateMongoId');
const asyncHandler = require('express-async-handler');

// To create a new category
const createLaundryCategory = asyncHandler(async (req, res) => {
    try {
        const newLaundryCategory = await LaundryCategory.create(req.body);
        if (newLaundryCategory) {
            res.json({
                message: 'Category successfully created',
                newLaundryCategory,
            });
        } else {
            throw new Error('Invalid category data, check your inputs!');
        }
    } catch (error) {
        throw new Error(error);
    }
});

// To Update Category
const updateLaundryCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    console.log(id)
    try {
        const updatedLaundryCategory = await LaundryCategory.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );
        if (updatedLaundryCategory) {
            res.json({
                message: 'Category successfully updated',
                updatedLaundryCategory,
            });
        } else {
            throw new Error('Invalid laundryCategory data, check your inputs!');
        }
    } catch (error) {
        throw new Error(error);
    }
});

// To Get A Category
const getALaundryCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const laundryCategory = await LaundryCategory.findById(id);
        if (laundryCategory) {
            res.json({
                message: 'Category successfully fetched',
                laundryCategory,
            });
        } else {
            throw new Error('Invalid laundryCategory data, check your inputs!');
        }
    } catch (error) {
        throw new Error(error);
    }
});

// To Get All Categories
const getAllLaundryCategories = asyncHandler(async (req, res) => {
    try {
        const laundryCategories = await LaundryCategory.find();
        if (laundryCategories) {
            res.json({
                message: 'Categories successfully fetched',
                laundryCategories,
            });
        } else {
            throw new Error('Invalid laundryCategories data, check your inputs!');
        }
    } catch (error) {
        throw new Error(error);
    }
});

// To Delete A Category
const deleteLaundryCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const deletedLaundryCategory = await LaundryCategory.findByIdAndDelete(id);
        if (deletedLaundryCategory) {
            res.json({
                message: 'Category successfully deleted',
                deletedLaundryCategory,
            });
        } else {
            throw new Error('Invalid laundryCategory data, check your inputs!');
        }
    } catch (error) {
        throw new Error(error);
    };
});


module.exports = {createLaundryCategory, updateLaundryCategory, getALaundryCategory, getAllLaundryCategories, deleteLaundryCategory}
