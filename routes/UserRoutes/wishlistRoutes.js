const express=require('express')
const router=express.Router();
const wishlistController=require('../../Cantroller/wishlistController')

router.get('/wishlist',wishlistController.wishlistget)


router.get('/add-to-wishlist',wishlistController.addwishlist)

router.get('/remove-wishlist',wishlistController.getwishlist)
module.exports=router;