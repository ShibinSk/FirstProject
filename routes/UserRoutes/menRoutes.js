const express=require('express');
const router=express.Router();


const  menRouter=require('../../Cantroller/menController')

router.get('/men',menRouter.menget);

module.exports=router;