const express=require('express');
const router=express.Router();
const userMiddlewere=require('../../Middleweres/userMiddlewere')


const loginController=require('../../Cantroller/loginContoller')

router.get('/login',userMiddlewere.isLogin,loginController.loginget)

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


router.post('/resend-otp',loginController.resentotp)





module.exports=router;

