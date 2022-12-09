const express=require('express');
const router=express.Router();
const userMiddlewere=require('../../Middleweres/userMiddlewere')

const  menRouter=require('../../Cantroller/menController')

router.get('/men',userMiddlewere.isLogout,menRouter.menget);

router.get('/about',userMiddlewere.isLogout,menRouter.aboutget)

router.get('/contact',userMiddlewere.isLogout,menRouter.contactget) 

module.exports=router;