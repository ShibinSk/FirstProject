const express=require('express')
const router=express.Router();

const offerController=require('../../Cantroller/offerController')


// ==================add offer =============================


router.get('/offer',offerController.getoffer)
router.post('/add-offer',offerController.addoffer)
// ===================delete offer==================================================

router.get('/delete-product-offer/:id',offerController.deleteoffer)
router.get('/delete-category-offfer/:category',offerController.deletecategoryoffer)

module.exports=router; 