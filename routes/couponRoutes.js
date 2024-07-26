const express = require('express');
const { getAllCoupons, getCouponById, createCoupon, deleteCoupon, validateCoupon, updateCoupon } = require('../controllers/couponController');
const { isAdmin, AuthenticatorJWT } = require('../middlewares/authenticator');

const router = express.Router();

router.get('/', AuthenticatorJWT, isAdmin, getAllCoupons);
router.get('/coupon/:id', AuthenticatorJWT, getCouponById);
router.post('/validate', AuthenticatorJWT, validateCoupon);
router.post('/create', AuthenticatorJWT, isAdmin, createCoupon);
router.put('/update/:id', AuthenticatorJWT, isAdmin, updateCoupon);
router.delete('/delete/:id', AuthenticatorJWT, isAdmin, deleteCoupon);


module.exports = router;