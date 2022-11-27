const express=require('express')
const router=express.Router();
const wishlistController=require('../../Cantroller/wishlistController')

router.get('/wishlist',wishlistController.wishlistget)

module.exports=router;