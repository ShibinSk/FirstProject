var db = require("../config/connection");
var collection = require("../config/collection");
const ObjectId = require("mongodb").ObjectId;

exports.getcoupon = async (req, res) => {
  try {
    const coupons = await db
      .get()
      .collection(collection.COUPONS_COLLECTION)
      .find()
      .toArray();

    res.render("Admin/coupon", { admin: true, coupons });
  } catch (err) {
    res.render('error',{navside:true});
  }
};

exports.addcoupon = async (req, res) => {
  try {
    let date = req.body.expDate;
    date = date.split("-").reverse().join("/");
    console.log(req.body);
    const obj = {
      coupon: req.body.coupon,
      discount: Number(req.body.couponOffer) ,
      minprice:Number( req.body.minPrice),
      pricelimit: Number(req.body.priceLimit),
      expdate:date
    
    };
    await db.get().collection(collection.COUPONS_COLLECTION).insertOne(obj);
    console.log(obj);
    res.redirect("back");
  } catch (err) {
    res.render('error',{navside:true});
  }
};

// ============= delete coupon ==============================

exports.deletecupon = async (req, res) => {
  try {
    console.log(req.params.id);
    prodId = req.params.id;

    await db
      .get()
      .collection(collection.COUPONS_COLLECTION)
      .deleteOne({ _id: ObjectId(prodId) });
    res.redirect("back");
  } catch (err) {
    res.render('error',{navside:true});
  }
};
