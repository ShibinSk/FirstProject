const express=require('express');
const router=express.Router();
const productdetailscantroller=require('../../Cantroller/productdetailsCanttroller')

router.get('/product-details',productdetailscantroller.detailsget)

module.exports=router;