const express=require('express');
const router=express.Router();
const loginController=require('../../Cantroller/adminloginCantroller')

router.get('/adminHome',loginController.loginget)


router.post('/adminHome',loginController.loginpost)


module.exports=router;