const db = require("../config/connection");
const collection = require("../config/collection");
const ObjectId = require("mongodb").ObjectId;

exports.userproget= async(req,res)=>{

    

    try {

        const id = req.session.user._id
        const users = await db
        .get()
        .collection(collection.USER_COLLECTION)
        .findOne({_id:ObjectId(id)})
        
        
        console.log(users);

        const address = await db
        .get()
        .collection(collection.USER_COLLECTION)
        .find()
        .toArray()



        res.render('user/userPro',{navside:true,users:users,navside:true,user:req.session.user,address:address[0].address})
    } catch (err) {
        console.log(err);
        
    }
    
}