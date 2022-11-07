const express=require('express');
const router=express.Router();

const adminRoutes=require('../../Cantroller/adminCantroller')


router.get('/',adminRoutes.adminget);

module.exports=router;
