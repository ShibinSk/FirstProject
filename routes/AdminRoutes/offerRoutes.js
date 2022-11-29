const express=require('express')
const router=express.Router();

const offerController=require('../../Cantroller/offerController')


// ==================add offer =============================


router.get('/offer',offerController.getoffer)
router.post('/add-offer',offerController.addoffer)

module.exports=router; 