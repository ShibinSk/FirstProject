const express=require('express')
const router=express.Router();

const dashbordCantroller=require('../../Cantroller/dashbordController')

router.get('/dashbord',dashbordCantroller.dashbordget)




// ====================== sales areport ============================================


router.get('/sales',dashbordCantroller.getsales)
module.exports=router;