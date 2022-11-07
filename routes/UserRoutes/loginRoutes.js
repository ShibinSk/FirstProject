const express=require('express');
const router=express.Router();


const loginController=require('../../Cantroller/loginContoller')

router.get('/login',loginController.loginget)

router.post('/login',loginController.loginpost)


// =====================================================================================================

router.get('/signup',loginController.signinget)

router.post('/signup',loginController.signuppost)

router.get('/logout',loginController.logoutget)



router.get('/otp',loginController.otpget)
module.exports=router;