const ClothCategory = require('../models/clothCategoryModel');
const asyncHandler = require('express-async-handler');
const { validateMongoDbId } = require('../utils/validateMongoId');

// To create a new category
const createClothCategory = asyncHandler(async (req, res) => {
    try {
        const newClothCategory = await ClothCategory.create(req.body);
        if (newClothCategory) {
            res.json({
                message: 'Category successfully created',
                newClothCategory,
            });
        } else {
            throw new Error('Invalid category data, check your inputs!');
        }
    } catch (error) {
        throw new Error(error);
    }
});

// To Update Category
const updateClothCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    console.log(id)
    try {
        const updatedClothCategory = await ClothCategory.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );
        if (updatedClothCategory) {
            res.json({
                message: 'Category successfully updated',
                updatedClothCategory,
            });
        } else {
            throw new Error('Invalid updatedClothCategory data, check your inputs!');
        }
    } catch (error) {
        throw new Error(error);
    }
}); 

// To Get A Category
const getAClothCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const clothCategory = await ClothCategory.findById(id);
        if (clothCategory) {
            res.json({
                message: 'Category successfully fetched',
                clothCategory,
            });
        } else {
            throw new Error('Invalid clothCategory data, check your inputs!');
        }
    } catch (error) {
        throw new Error(error);
    }
});

// To Get All Categories
const getAllClothCategories = asyncHandler(async (req, res) => {
    try {
        const clothCategories = await ClothCategory.find({});
        if (clothCategories) {
            res.json({
                message: 'Categories successfully fetched',
                clothCategories,
            });
        } else {
            throw new Error('Invalid clothCategories data, check your inputs!');
        }
    } catch (error) {
        throw new Error(error);
    }
});

// To Delete Category
const deleteClothCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const deletedCategory = await ClothCategory.findByIdAndDelete(id);
        if (deletedCategory) {
            res.json({
                message: 'Category successfully deleted',
                deletedCategory,
            });
        } else {
            throw new Error('Invalid deletedCategory data, check your inputs!');
        }
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = {createClothCategory, updateClothCategory,getAClothCategory,getAllClothCategories ,deleteClothCategory}