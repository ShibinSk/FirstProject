const express=require('express');

const router=express.Router();

catagoryCantroller=require('../../Cantroller/catagoryCantroller')



// add category =================================================================================
router.post('/category',catagoryCantroller.catagorypost)

router.get('/category',catagoryCantroller.catagoryget)




// delete ========================================================================================
router.get('/delete-category',catagoryCantroller.deletecategoryget)

// edit  ==========================================================================================

router.get('/edit-category',catagoryCantroller.editcategoryget)

router.post('/edit-category',catagoryCantroller.editcategorypost)

module.exports=router;