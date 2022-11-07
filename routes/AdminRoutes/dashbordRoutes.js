const express=require('express')
const router=express.Router();

const dashbordCantroller=require('../../Cantroller/dashbordController')

router.get('/dashbord',dashbordCantroller.dashbordget)
module.exports=router;