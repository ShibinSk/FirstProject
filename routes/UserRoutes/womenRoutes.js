const express=require('express');
const router=express.Router();
const userMiddlewere=require('../../Middleweres/userMiddlewere')
const womenController=require('../../Cantroller/womenController')

router.get('/women',userMiddlewere.isLogout,womenController.getwomen)

module.exports=router;