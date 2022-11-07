const express=require('express');

const router=express.Router();

const addproductsCantroller=require('../../Cantroller/addproductsCantroller')


router.get('/view-products',addproductsCantroller.viewproductsget)


router.get('/add-products',addproductsCantroller.addproductsget)


router.post('/add-products',addproductsCantroller.addproductspost)


// ==========================================================================================================================



router.get('/delete-products/:id',addproductsCantroller.deleteget)

router.get('/edit-products',addproductsCantroller.editget)

router.post('/edit-products',addproductsCantroller.editpost)

module.exports=router;
