const LaundryOrder = require('../models/orderModel');
const AsyncHandler = require('express-async-handler');
const slugify = require('slugify');
const Clothing = require('../models/clothingModel');

// To create Fabrics Order.
const createClothOrder = AsyncHandler(async (req, res) => {
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
const getAllClothOrders = AsyncHandler(async (req, res) => {
    try {
        const allClothOrders = await Clothing.find({});
        if(allClothOrders){
            res.json({
                allClothOrders,
                message: 'All cloth orders successfully retrieved',
            })
        } else {
            throw new Error('No cloth orders found');
        }
    } catch (error) {
        throw new Error(error);
    };
});

// To Get A Fabric Order.
const getAClothOrder = AsyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const clothOrder = await Clothing.findById(id);
        if(clothOrder){
            res.json({
                clothOrder,
                message: 'Cloth order successfully retrieved',
            })
        } else {
            throw new Error('No cloth order found');
        }
    } catch (error) {
        throw new Error(error);
    };
});

// To Update Fabric Order.
const updateClothOrder = AsyncHandler(async (req, res) => {
    const { id } = req.params;
    // console.log(req.params);
    try {
        const updatedFabricOrder = await Clothing.findOneAndUpdate(id, req.body, {new: true});
        if(updatedFabricOrder){
            res.json({
                updatedFabricOrder,
                message: 'Cloth order successfully updated',
            })
        } else {
            throw new Error('No cloth order found');
        }
    } catch (error) {
        throw new Error(error);
    };
});

// To delete/cancel Fabric Order.
const deleteClothOrder = AsyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const deletedClothOrder = await Clothing.findByIdAndDelete(id);
        if(deletedClothOrder){
            res.json({
                deletedClothOrder,
                message: 'Cloth order successfully deleted',
            })
        } else {
            throw new Error('No cloth order found');
        }
    } catch (error) {
        throw new Error(error);
    };
});

module.exports = {createClothOrder, getAllClothOrders, getAClothOrder, updateClothOrder, deleteClothOrder};