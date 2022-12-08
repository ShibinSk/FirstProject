const express=require('express')
const router=express.Router();

const dashbordCantroller=require('../../Cantroller/dashbordController')

router.get('/dashbord',dashbordCantroller.dashbordget)




// ====================== sales areport ============================================


router.get('/sales-report',dashbordCantroller.getsales)

// router.get('/sales-report',dashbordCantroller.getreport)
module.exports=router;