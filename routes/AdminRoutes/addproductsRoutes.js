const express=require('express');

const router=express.Router();

const addproductsCantroller=require('../../Cantroller/addproductsCantroller')

//===============================Product View,Add===============================================================================================================
router.get('/view-products',addproductsCantroller.viewproductsget)


router.get('/add-products',addproductsCantroller.addproductsget)


router.post('/add-products',addproductsCantroller.addproductspost)


// ==============================Product Delete ,Edit ============================================================================================



router.get('/delete-products/:id',addproductsCantroller.deleteget)

router.get('/edit-products',addproductsCantroller.editget)

router.post('/edit-products',addproductsCantroller.editpost)

module.exports=router;
