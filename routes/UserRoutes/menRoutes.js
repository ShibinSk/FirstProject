const express=require('express');
const router=express.Router();
const userMiddlewere=require('../../Middleweres/userMiddlewere')

const  menRouter=require('../../Cantroller/menController')

router.get('/men',userMiddlewere.isLogout,menRouter.menget);

module.exports=router;