const express = require('express');
const app = express();
const { isAdmin, authMiddleware } = require('../middlewares/authMiddleware');
const {uploadPhoto, clothImgResize} = require('../middlewares/uploadImages');
const {createClothOrder, getAllClothOrders, getAClothOrder, updateClothOrder, deleteClothOrder, likeClothing, dislikeClothing,addToWishlist,ratingHandler, uploadImages } = require('../controller/clothingCtrl');
const router = express.Router();

router.post('/',authMiddleware,isAdmin, createClothOrder)
router.put('/upload/:id',authMiddleware,isAdmin,uploadPhoto.array("images", 10),clothImgResize, uploadImages)
router.put('/likes',authMiddleware,isAdmin, likeClothing)
router.put('/dislikes',authMiddleware,isAdmin, dislikeClothing)
router.put('/wishlist',authMiddleware, addToWishlist)
router.put('/rating',authMiddleware, ratingHandler)

router.put('/:id',authMiddleware,isAdmin, updateClothOrder)
router.get('/',authMiddleware,isAdmin, getAllClothOrders)
router.get('/:id', getAClothOrder)
router.delete('/:id',authMiddleware,isAdmin, deleteClothOrder)

module.exports = router