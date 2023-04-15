const PromoCode = require('../models/promoCodeModel');
const { validateMongoDbId } = require('../utils/validateMongoId');
const asyncHandler = require('express-async-handler');

// To create Promo Code.
const createPromoCode = asyncHandler(async (req, res) => {
    try {
        const newPromoCode = await PromoCode.create(req.body);
        if (newPromoCode) {
            res.json({
                message: 'Promo code successfully created',
                newPromoCode,
            });
        } else {
            throw new Error('Invalid promo code data, check your inputs!');
        }
    } catch (error) {
        throw new Error(error);
    }
});

// To Get All Promo Codes.
const getAllPromoCodes = asyncHandler(async (req, res) => {
    try {
        const allPromoCodes = await PromoCode.find({});
        if (allPromoCodes) {
            res.json({
                message: 'All promo codes successfully retrieved',
                allPromoCodes,
            });
        } else {
            throw new Error('No promo codes found');
        }
    } catch (error) {
        throw new Error(error);
    }
});

// To Get A Promo Code.
const getAPromoCode = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const newPromoCode = await PromoCode.findById(id);
        if (newPromoCode) {
            res.json({
                message: 'Promo code successfully retrieved',
                newPromoCode,
            });
        } else {
            throw new Error('No promo code found');
        }
    } catch (error) {
        throw new Error(error);
    }
});

// To Update A Promo Code.
const updatePromoCode = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const updatedPromoCode = await PromoCode.findByIdAndUpdate(
            id,
            {
                $set: req.body,
            },
            { new: true }
        );
        if (updatedPromoCode) {
            res.json({
                message: 'Promo code successfully updated',
                updatedPromoCode,
            });
        } else {
            throw new Error('No promo code found');
        }
    } catch (error) {
        throw new Error(error);
    }
});

// To Delete A Promo Code.
const deletePromoCode = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const deletedPromoCode = await PromoCode.findByIdAndDelete(id);
        if (deletedPromoCode) {
            res.json({
                message: 'Promo code successfully deleted',
                deletedPromoCode,
            });
        } else {
            throw new Error('No promo code found');
        }
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = { createPromoCode, getAllPromoCodes, getAPromoCode, updatePromoCode, deletePromoCode}
