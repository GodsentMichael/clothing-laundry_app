const express = require('express');
const app = express();
const {createClothOrder, getAllClothOrders, getAClothOrder, updateClothOrder, deleteClothOrder} = require('../controller/clothingCtrl');
const router = express.Router();

router.post('/', createClothOrder)
router.get('/', getAllClothOrders)
router.get('/:id', getAClothOrder)
router.put('/:id', updateClothOrder)
router.delete('/:id', deleteClothOrder)

module.exports = router