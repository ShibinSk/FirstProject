const db=require('../config/connection')
const collection=require('../config/collection')
exports.homeget=async(req,res)=>{
    let user=req.session.user
    console.log(user);

    try{

        const products=await db
        .get().collection(collection.PRODUCT_COLLECTION)
        .find()
        .toArray()
        console.log(products);
        res.render('index',{admin:false,products,user})
    }catch(err){
        console.log(err);

    }


    
}