var db = require("../config/connection");
var collection = require("../config/collection");
const { payment } = require("paypal-rest-sdk");
const ObjectId = require("mongodb").ObjectId;

exports.dashbordget = async (req, res) => {
  try {
    // ====user count ======

    const usercount = await db
      .get()
      .collection(collection.USER_COLLECTION)
      .find()
      .count();
    console.log(usercount, "////////////////////////");

    // ==== product count ====

    const productcount = await db
      .get()
      .collection(collection.PRODUCT_COLLECTION)
      .find()
      .count();

    //==== catrgory count ====
    const categorycount = await db
      .get()
      .collection(collection.CART_COLLECTION)
      .find()
      .count();

    // === order status ====

    const orderstatus = await db
      .get()
      .collection(collection.ORDER_COLLECTION)
      .aggregate([
        {
          $group: {
            _id: "$status",
            status: {
              $sum: 1,
            },
          },
        },
      ])
      .toArray();

    const ordercount = await db
      .get()
      .collection(collection.ORDER_COLLECTION)
      .find()
      .count();
    console.log(ordercount, "pppppppppppppp");

    const cod = await db
      .get()
      .collection(collection.ORDER_COLLECTION)
      .find({ payment: "COD" })
      .count();
    console.log(cod);

    const paypal = await db
      .get()
      .collection(collection.ORDER_COLLECTION)
      .find({ payment: "Paypal" })
      .count();
    console.log(paypal);
    const razorpay = await db
      .get()
      .collection(collection.ORDER_COLLECTION)
      .find({ payment: "Razorpay" })
      .count();
    console.log(razorpay);
    
//  =========== order status cound =============
 
const ordershipped = await db
.get()
.collection(collection.ORDER_COLLECTION)
.find({status:"shipped"})
.count()

const orderpending = await db
.get()
.collection(collection.ORDER_COLLECTION)
.find({status:"pending"})
.count()

const ordercanceled = await db
.get()
.collection(collection.ORDER_COLLECTION)
.find({status:"canceled"})
.count()

const orderplaced = await db
.get()
.collection(collection.ORDER_COLLECTION)
.find({status:"placed"})
.count()

const orderdeliverd = await db
.get()
.collection(collection.ORDER_COLLECTION)
.find({status:"delivered"})
.count()




    console.log(orderstatus);
    res.render("Admin/dashbord", {
      admin: true,
      usercount,
      orderstatus,
      categorycount,
      productcount,
      ordercount,
      cod,
      paypal,
      razorpay,
      ordershipped,
      orderpending,
      ordercanceled,
      orderplaced ,
      orderdeliverd


    });
  } catch (err) {
    console.log(err);
  }
};
