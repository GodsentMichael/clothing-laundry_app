const express = require('express');
const { createLaundryOrder, getALaundryOrder, getAllLaundryOrders, updateLaundryOrder, deleteLaundryOrder } = require('../controller/laundryOrderCtrl');
const router = express.Router();
const {isAdmin, authMiddleware} = require('../middlewares/authMiddleware');

router.post('/',authMiddleware,isAdmin, createLaundryOrder)
router.get('/:id', getALaundryOrder)
router.get('/', getAllLaundryOrders)
router.put('/:id',authMiddleware,isAdmin, updateLaundryOrder)
router.delete('/:id',authMiddleware,isAdmin, deleteLaundryOrder)

module.exports = router;
