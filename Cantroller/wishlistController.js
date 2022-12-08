const db = require("../config/connection");
const collection = require("../config/collection");
const ObjectId = require("mongodb").ObjectId;

exports.wishlistget = async (req, res) => {
  try {
    if (req.session.loggedIn) {
       
      const userid = req.session.user._id;
      

      const wishlist = await db
        .get()
        .collection(collection.WISHLIST_COLLECTION)
        .aggregate([
          {
            $match: {
              user: ObjectId(userid),
            },
          },
          {
            $unwind: "$products",
          },
          {
            $project: {
              item: "$products.item",
              quantity: "$products.quantity",
            },
          },
          {
            $lookup: {
              from: collection.PRODUCT_COLLECTION,
              localField: "item",
              foreignField: "_id",
              as: "product",
            },
          },
          {
            $project: {
              product_Id: 1,
              quantity: 1,
              products: { $arrayElemAt: ["$product", 0] },
            },
          },
        ])
        .toArray();

     
        console.log(wishlist.length);
      console.log(wishlist);
      res.render("User/wishlist", {
        navside: true,
        user: req.session.user,
        wishlistItems: wishlist
      });
    }else{
        res.redirect("/User/login");
    }
    
  } catch (err) {
    console.log(err);
  }
};

exports.addwishlist = async (req, res) => {
  try {

    if(req.session.loggedIn){

        console.log(req.query._id,'111111111111111111111111111111111111111');
        const proId = req.query._id;
        const userId = req.session.user._id;
    
        const obj = {
          item: ObjectId(proId),
          quantity: 1,
        };
        const userwishlist = await db
          .get()
          .collection(collection.WISHLIST_COLLECTION)
          .findOne({ user: ObjectId(userId) });
    
        if (userwishlist) {
          const proExit = userwishlist.products.findIndex(
            (product) => product.item == proId
          );
    
          if (proExit != -1) {
            const proExit = await db
              .get()
              .collection(collection.WISHLIST_COLLECTION)
              .findOne(
                { user: ObjectId(userId), "products.item": ObjectId(proId) },
                {
                  $inc: { "products.$.item": 1 },
                }
              );
          } else {
            const product = await db
              .get()
              .collection(collection.WISHLIST_COLLECTION)
              .updateOne(
                { user: ObjectId(userId) },
                {
                  $push: {
                    products: obj,
                  },
                }
              );
            res.redirect("/");
          }

          const wishdelete = await db
          .get()
          .collection(collection.WISHLIST_COLLECTION)
          .deleteOne({user:(ObjectId(proId))})
          res.redirect("/");

        } else {
          const obj = {
            user: ObjectId(userId),
            products: [{ item: ObjectId(proId), quantity: 1 }],
          };
          const cart = await db
            .get()
            .collection(collection.WISHLIST_COLLECTION)
            .insertOne(obj);
          res.redirect("/");
        }
        
    }else{
        res.redirect("/User/login");

    }
  } catch (err) {
    console.log(err);
  }
};


exports.getwishlist= async(req,res)=>{
    console.log(req.query.id);
    const prodid= req.query.id
    const userId=req.session.user._id
    console.log(userId,'wwwwwwwwwwwwwwwwwwwwwww');
    
    const result = await db
    .get()
    .collection(collection.WISHLIST_COLLECTION)
    .update(
      { user: ObjectId(userId) },
      {
        $pull: { products: { item: ObjectId(prodid) } },
      }
    );
  res.redirect("/user/wishlist");

}