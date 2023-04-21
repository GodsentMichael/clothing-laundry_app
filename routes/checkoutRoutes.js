const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const {checkoutOrder} = require('../controller/checkOutCtrl');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.post('/cart/checkout',authMiddleware, checkoutOrder)
router.get('/:id',authMiddleware,checkoutOrder)

module.exports = router;