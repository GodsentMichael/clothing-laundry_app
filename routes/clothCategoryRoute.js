const express = require('express'); 
const {createClothCategory, updateClothCategory,getAClothCategory,getAllClothCategories ,deleteClothCategory} = require('../controller/clothCategoryCtrl');
const {authMiddleware,isAdmin} = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/',authMiddleware,isAdmin, createClothCategory)
router.get('/:id',authMiddleware,isAdmin, getAClothCategory)
router.get('/',authMiddleware,isAdmin, getAllClothCategories)
router.put('/:id',authMiddleware,isAdmin, updateClothCategory)
router.delete('/:id',authMiddleware,isAdmin, deleteClothCategory)

module.exports = router;
