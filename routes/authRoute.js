const express = require('express');
const router = express.Router();
const {
	createUser,
	loginUser,
	getAllUsers,
	getAUser,
	deleteAUser,
	updatedUser,
    unblockUser,
    blockUser,
	refreshTokenHandler,
	logoutUser,
	updatePassword,
	forgotPasswordToken,
	resetPassword,upload,loginAdmin,getWishList,saveUserAddress,userCart,getUserCart,emptyCart ,multerFilter, applyPromoCode,
} = require('../controller/userCtrl');
const {uploadPhoto, profileImgResize} = require('../middlewares/uploadImages');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const crypto = require("crypto");

router.post('/register',upload.single("profileImage"),profileImgResize, createUser);
// router.post('/register', uploader.single("file"), createUser);
router.post('/forgot-password-token', forgotPasswordToken);
router.put('/reset-password/:token', resetPassword);

router.put('/password',authMiddleware ,updatePassword);
router.post('/login', loginUser);
router.post('/admin-login', loginAdmin);
router.post('/cart',authMiddleware, userCart);
router.post('/cart/apply-promocode',authMiddleware,applyPromoCode);
router.get('/all-cart',authMiddleware, getUserCart);
router.delete('/empty-cart',authMiddleware, emptyCart);
router.get('/all-users', getAllUsers);
router.get('/refresh',refreshTokenHandler);

router.post('/logout', logoutUser);
router.get('/wishlist', authMiddleware, getWishList);
router.get('/:id', authMiddleware,isAdmin, getAUser);
router.delete('/:id', deleteAUser);

router.put('/edit-user',authMiddleware, updatedUser);
router.put('/save-address',authMiddleware, saveUserAddress);
router.put('/block-user/:id',authMiddleware,isAdmin, blockUser);
router.put('/unblock-user/:id',authMiddleware,isAdmin, unblockUser);

module.exports = router;
