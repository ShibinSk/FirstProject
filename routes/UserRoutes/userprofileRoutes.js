const express=require('express');
const router =express.Router();
const userproController=require('../../Cantroller/userproController')

router.get('/userPro',userproController.userproget)

//===================================user Address Managment ===============================
router.get('/delete-address',userproController.deleteAddress)

router.get('/edit-address',userproController.editaddress)

router.post('/edit-address',userproController.posteditaddress)
module.exports=router;
