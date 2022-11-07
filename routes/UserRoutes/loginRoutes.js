const express=require('express');
const router=express.Router();


const loginController=require('../../Cantroller/loginContoller')

router.get('/login',loginController.loginget)

router.post('/login',loginController.loginpost)


//  =======================================Signin==============================================================

router.get('/signup',loginController.signinget)

router.post('/signup',loginController.signuppost)

router.get('/logout',loginController.logoutget)

//  =======================================OTP SECTION==================================================

router.get('/otp-login',loginController.otploginget)

router.post('/otp-login',loginController.otppost)


router.get('/otp',loginController.getsubmit)

router.post('/otp',loginController.postsubmit)



module.exports=router;

