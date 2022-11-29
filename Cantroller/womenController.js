const db = require("../config/connection");
const collection = require("../config/collection");
const ObjectId = require("mongodb").ObjectId;


exports.getwomen= async(req,res)=>{

    try {
        const women= await  db
        .get()
        .collection(collection.PRODUCT_COLLECTION)
        .find({category:"WOMEN"})
        .toArray()
        console.log(women,'/////////////////]');
        
        res.render('User/women',{user:req.session.user,women})
    } catch (err) {
        res.render(console.error(error))
        console.log(err);
        
    }

}