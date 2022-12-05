const db = require("../config/connection");
const collection = require("../config/collection");
const ObjectId = require("mongodb").ObjectId;
exports.homeget = async (req, res) => {
  try {
    let user = req.session.user;
    console.log(user);
    

    let count = 0;
    if (req.session.loggedIn) {
      const userId = req.session.user._id;

      let cart = await db
        .get()
        .collection(collection.CART_COLLECTION)
        .findOne({ user: ObjectId(userId) });

      if (cart) {
        count = cart.products.length;
      }

      
      
      // const wishlistcount=await db
      // .get()
      // .collection(collection.WISHLIST_COLLECTION)
      // .findOne({user:ObjectId(userId)})


      // if( wishlistcount){
      //   countwish= wishlistcount.products.length
      // }
    }

    const products = await db
      .get()
      .collection(collection.PRODUCT_COLLECTION)
      .find()
      .toArray();

    res.render("index", { admin: false, products, user, count});
  } catch (err) {
    console.log(err);
  }
};




