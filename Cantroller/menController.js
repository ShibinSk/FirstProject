
const db = require("../config/connection");
const collection = require("../config/collection");
const ObjectId = require("mongodb").ObjectId;
exports.menget= async(req,res)=>{

    try {
        const men = await db
        .get()
        .collection(collection.PRODUCT_COLLECTION)
        .find({category:"MEN"})
        .toArray()
        console.log(men,'rrrrrrrrrrrrrrrrrrrrrrrrrr');



        res.render('User/men',{user:req.session.user,men})
        
    } catch (err) {
        
    }
   
    
    
}

exports.aboutget=(req,res)=>{
    res.render('User/about',{user:req.session.user})
}

exports.contactget=(req,res)=>{
    res.render('User/contact',{user:req.session.user})
}