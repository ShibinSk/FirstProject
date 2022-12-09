var db = require("../config/connection");
var collection = require("../config/collection");
const ObjectId=require('mongodb').ObjectId
// const { router } = require("../app");

exports.detailsget= async(req,res)=>{
    try {
      const id = req.query.id;
      console.log(id);
        const products = await db
          .get()
          .collection(collection.PRODUCT_COLLECTION)
          .findOne({ _id: ObjectId(id)})
          // .toArray();
        
          res.render('User/product-details',{navside:true,products})
          

      } catch (err) {
        res.render('error',{navside:true});
      }
    };


    


   