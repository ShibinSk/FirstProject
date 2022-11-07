var db = require("../config/connection");
var collection = require("../config/collection");
const { get } = require("../app");
const { ObjectId } = require("mongodb");

exports.usersget=async(req,res)=>{


    try {
        const users= await db
        .get()
        .collection(collection.USER_COLLECTION)
        .find()
        .toArray()

        res.render('admin/view-users',{admin:true,users})

       
    } catch (err) {
        console.log(err);
        
    }
}

// blockuser ================================================================================

exports.blockuser= async(req,res)=>{

    try {
        console.log(req.params.id);
    const id=req.params.id
    console.log(id);

    const user = await db
    .get()
    .collection(collection.USER_COLLECTION)
    .updateOne({_id:ObjectId(id)},{
      $set:{
        status:'block'
      }

    });
    res.redirect("/admin/view-users");

        
    } catch (err) {
        console.log(err);
        
    }
    



}

exports.unblockuser= async (req,res)=>{
    

    try {
        const id = req.query.id
        console.log(id);

        const user = await db
        .get()
        .collection(collection.USER_COLLECTION)
        .updateOne({_id:ObjectId(id)},{
            $set:{
                status:'active'

            }
        })
        res.redirect('/admin/view-users')
        
        
    } catch (err) {
        console.log(err);
    }

}

