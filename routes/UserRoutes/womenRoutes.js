const express=require('express');
const router=express.Router();

const womenController=require('../../Cantroller/womenController')

router.get('/women',womenController.getwomen)

module.exports=router;