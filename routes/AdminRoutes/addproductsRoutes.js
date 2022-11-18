const express=require('express');
const multer = require("multer");
const path =require('path')

const cloudinary = require("../../utils/cloudinary");

const router=express.Router();

const addproductsCantroller=require('../../Cantroller/addproductsCantroller')




// =================================MULTER==================================================================
upload =multer({

    storage: multer.diskStorage({
           destination: function (req, file, cb) {
               cb(null,"public/product-images")
           },
           filename: function (req, file, cb) {
            console.log(file);
            const url = file.originalname.split('.')[0]
            console.log(url)
               cb(null, `${url}.jpg`)
            
           },
           onerror:function(err, next) {
            console.log('error', err);
           }
       }),
    fileFilter: (req, file, cb) => {
      let ext = path.extname(file.originalname);
      if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png" && ext !== ".webp" ) {
        cb(new Error("File type is not supported"), false);
        return;
      }
      cb(null, true);
    },
  });




//===============================Product View,Add===============================================================================================================
router.get('/view-products',addproductsCantroller.viewproductsget)


router.get('/add-products',addproductsCantroller.addproductsget)


router.post('/add-products',
upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
addproductsCantroller.addproductspost)


// ==============================Product Delete ,Edit ============================================================================================



router.get('/delete-products/:id',addproductsCantroller.deleteget)

router.get('/edit-products',addproductsCantroller.editget)

router.post('/edit-products',
upload.fields([
  { name: "image1", maxCount: 1 },
  { name: "image2", maxCount: 1 },
  { name: "image3", maxCount: 1 },
  { name: "image4", maxCount: 1 },
]),
addproductsCantroller.editpost)


module.exports=router; 
