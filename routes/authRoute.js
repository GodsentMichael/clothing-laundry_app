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
	resetPassword,upload, multerFilter,
} = require('../controller/userCtrl');
const {uploadPhoto, profileImgResize} = require('../middlewares/uploadImages');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const crypto = require("crypto");

router.post('/register',upload.single("profileImage"),profileImgResize, createUser);
// router.post('/register', uploader.single("file"), createUser);
router.post('/forgot-password-token', forgotPasswordToken);
router.put('/reset-password/:token', resetPassword);
router.get('/refresh',refreshTokenHandler);
router.put('/password',authMiddleware ,updatePassword);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/all-users', getAllUsers);
router.get('/:id', authMiddleware,isAdmin, getAUser);
router.delete('/:id', deleteAUser);
router.put('/edit-user',authMiddleware, updatedUser);
router.put('/block-user/:id',authMiddleware,isAdmin, blockUser);
router.put('/unblock-user/:id',authMiddleware,isAdmin, unblockUser);

module.exports = router;
