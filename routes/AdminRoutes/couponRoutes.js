const express=require('express')
const router=express.Router();
const couponController= require('../../Cantroller/couponController')

router.get('/coupon',couponController.getcoupon)
router.post('/coupon',couponController.addcoupon)

// ================== delete coupon =========================

router.get('/coupon-delete/:id',couponController.deletecupon)
module.exports=router;
