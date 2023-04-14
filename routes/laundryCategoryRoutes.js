const express = require('express');
const {createLaundryCategory, updateLaundryCategory,getALaundryCategory, getAllLaundryCategories, deleteLaundryCategory} = require('../controller/laundryCategoryCtrl');
const { authMiddleware,isAdmin} = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/',authMiddleware,isAdmin ,createLaundryCategory);
router.put('/:id',authMiddleware,isAdmin ,updateLaundryCategory);
router.get('/:id',authMiddleware,isAdmin ,getALaundryCategory);
router.get('/',authMiddleware,isAdmin ,getAllLaundryCategories);
router.delete('/:id',authMiddleware,isAdmin ,deleteLaundryCategory);

module.exports = router;