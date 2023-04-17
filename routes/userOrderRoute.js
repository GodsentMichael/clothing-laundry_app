const express = require('express');
const router = express.Router();
// const {
// 	createUser,
// 	loginUser,
// 	getAllUsers,
// 	getAUser,
// 	deleteAUser,
// 	updatedUser,
//     unblockUser,
//     blockUser,
// 	refreshTokenHandler,
// 	logoutUser,
// 	updatePassword,
// 	forgotPasswordToken,
// 	resetPassword,upload,loginAdmin,getWishList,saveUserAddress,userCart,getUserCart,emptyCart ,multerFilter, applyPromoCode,
// } = require('../controller/userCtrl');
const {createOrder, getAllOrders, getSingleOrder, updateOrderStatus} = require('../controller/userOrderCtrl');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');


router.post('/cash-order',authMiddleware, createOrder);
router.get('/user-orders',authMiddleware, getAllOrders);
router.get('/user-orders/:id',authMiddleware, getSingleOrder);
router.put('/update-order/:id',authMiddleware,isAdmin, updateOrderStatus);

module.exports = router;