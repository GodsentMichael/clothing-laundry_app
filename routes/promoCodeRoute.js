const express = require('express');
const app = express();
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const { createPromoCode, getAllPromoCodes, getAPromoCode, updatePromoCode, deletePromoCode } = require('../controller/promoCodeCtrl');
const router = express.Router();

router.post('/',authMiddleware, isAdmin, createPromoCode);
router.get('/',authMiddleware, isAdmin,  getAllPromoCodes);
router.get('/:id',authMiddleware, isAdmin,  getAPromoCode);
router.put('/:id',authMiddleware, isAdmin,  updatePromoCode);
router.delete('/:id',authMiddleware, isAdmin, deletePromoCode);

module.exports = router;
 