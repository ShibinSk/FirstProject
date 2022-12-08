var db = require("../config/connection");
var collection = require("../config/collection");
const { get, render } = require("../app");

const ObjectId = require("mongodb").ObjectId;

// var accountSid = process.env.TWILIO_ACCOUNT_SID;
// var authToken = process.env.TWILIO_AUTH_TOKEN;
// const Client = require('twilio')(accountSid, authToken);

exports.usersget = async (req, res) => {
  try {
    const users = await db
      .get()
      .collection(collection.USER_COLLECTION)
      .find()
      .toArray();

    res.render("admin/view-users", { admin: true, users });
  } catch (err) {
    console.log(err);
  }
};

// blockuser ================================================================================

exports.blockuser = async (req, res) => {
  try {
    console.log(req.params.id);
    const id = req.params.id;
    console.log(id);

    const user = await db
      .get()
      .collection(collection.USER_COLLECTION)
      .updateOne(
        { _id: ObjectId(id) },
        {
          $set: {
            status: "block",
          },
        }
      );
    res.redirect("/admin/view-users");
  } catch (err) {
    console.log(err);
  }
};

exports.unblockuser = async (req, res) => {
  try {
    const id = req.query.id;
    console.log(id);

    const user = await db
      .get()
      .collection(collection.USER_COLLECTION)
      .updateOne(
        { _id: ObjectId(id) },
        {
          $set: {
            status: "active",
          },
        }
      );
    res.redirect("/admin/view-users");
  } catch (err) {
    console.log(err);
  }
};

exports.orders = async (req, res) => {
  const agg = [
    {
      $unwind: {
        path: "$products",
      },
    },
  ];

  const orders = await db
    .get()
    .collection(collection.ORDER_COLLECTION)
    .aggregate(agg)
    .sort({
      _id: -1,
    })
    .toArray();
  console.log(orders, "qqqqqqqqqqqqqqqqqqqq");

  const products = await db
    .get()
    .collection(collection.PRODUCT_COLLECTION)
    .find()
    .toArray();
  console.log("fffffffffffffffffffffff");
  console.log(products, "sdfgh");
  console.log(orders, "adasfad");

  res.render("admin/orders", { navside: true, orders: orders, products });
};

exports.statuspost = (req, res) => {
  console.log("ooooooooooooooooooooooooooooooooooooooo");
  console.log(req.body);

  let dateStatus = new Date();
  const status = req.body.status;
  
  const  orderId=req.body.orderId;
  const prodId=req.body.prodId;
  db.get()
    .collection(collection.ORDER_COLLECTION)
    .updateOne(
      { _id: ObjectId(orderId), "products._id": ObjectId(prodId) },
      { $set: { "status": status, statusUpdateDate: dateStatus } }
    )
    .then((response) => {
      console.log(response);
      res.json({ status: true });
    });
};
