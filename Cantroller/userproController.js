const db = require("../config/connection");
const collection = require("../config/collection");
const ObjectId = require("mongodb").ObjectId;

exports.userproget= async(req,res)=>{

    try {
        const users = await db
        .get()
        .collection(collection.USER_COLLECTION)
        .findOne()
        
        console.log(users);



        res.render('user/userPro',{navside:true,users,navside:true,user:req.session.user})
    } catch (err) {
        console.log(err);
        
    }
    
}