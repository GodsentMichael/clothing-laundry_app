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
	logoutUser
} = require('../controller/userCtrl');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

router.get('/refresh',refreshTokenHandler);
router.post('/register', createUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/all-users', getAllUsers);
router.get('/:id', authMiddleware,isAdmin, getAUser);
router.delete('/:id', deleteAUser);
router.put('/edit-user',authMiddleware, updatedUser);
router.put('/block-user/:id',authMiddleware,isAdmin, blockUser);
router.put('/unblock-user/:id',authMiddleware,isAdmin, unblockUser);

module.exports = router;
