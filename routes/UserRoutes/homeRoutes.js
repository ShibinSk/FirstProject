var express=require('express');
var router =express.Router();


const homeCantoller=require('../../Cantroller/homeCantoller')

// router.get('/',((req,res)=>{
//     res.render('index',{admin:false})
// }));

router.get('/',homeCantoller.homeget)



module.exports=router;