

const express=require('express');
const router=express.Router();

const usersCantroller=require('../../Cantroller/usersCantroller')



router.get('/view-users',usersCantroller.usersget)

module.exports=router;

// blockUser ==================================

router.get('/block-user/:id',usersCantroller.blockuser)

//  unblockuseruser ===========================
 
router.get('/unblock-user',usersCantroller.unblockuser)



// ==================orders====================
 
router.get('/orders',usersCantroller.orders)