const express=require('express');
const router =express.Router();
const userproController=require('../../Cantroller/userproController')

router.get('/userPro',userproController.userproget)
module.exports=router;