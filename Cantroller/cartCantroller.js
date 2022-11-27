var db = require("../config/connection");
var collection = require("../config/collection");
const { CallPage } = require("twilio/lib/rest/insights/v1/call");
const { get, response } = require("../app");
const ObjectId = require("mongodb").ObjectId;
const Razorpay = require("razorpay");
const paypal = require("paypal-rest-sdk");

// ===========Razorpya configure==================
var instance = new Razorpay({
  key_id: "rzp_test_RF0nTXmxHqKSxA",
  key_secret: "r7g6b2ScrJedg3CddhpF3v9x",
});

//==============Paypal cofigure=======================
paypal.configure({
  mode: "sandbox",
  client_id:
    "ASfcPO2CxnW9RVXGxca4WmjXRD8vYgC9sijMjWaicr1wo8WesgwCJplOmLj8KsBILvWvNnRmgXQWKCgD",
  client_secret:
    "EDTonib9jW4tOZdb_-AJigS5gywDhAi_uJUtY5TPxErOwMu_-cNz_cjguHOGme97KDHbx2N8EHREnNKb",
});

exports.cartget = async (req, res) => {
  try {
    if (req.session.loggedIn) {
      const productId = req.query._id;
      const userId = req.session.user._id;

      console.log(userId);

      const cartItems = await db
        .get()
        .collection(collection.CART_COLLECTION)
        .aggregate([
          {
            $match: {
              user: ObjectId(userId),
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
      console.log(cartItems);

      // =======================================================================

      const total = await db
        .get()
        .collection(collection.CART_COLLECTION)
        .aggregate([
          {
            $match: {
              user: ObjectId(userId),
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
          {
            $group: {
              _id: null,
              total: { $sum: { $multiply: ["$quantity", "$products.price"] } },
            },
          },
        ])
        .toArray();

      res.render("User/cart", {
        user: req.session.user,
        navside: true,
        cartItems: cartItems,
        user: req.session.user,
        total: total[0].total,
      });
    } else {
      res.redirect("/User/login");
    }
  } catch (err) {
    console.log(err);
  }
};

exports.addcartget = async (req, res) => {
  try {
    if (req.session.loggedIn) {
      const productId = req.query._id;
      const userId = req.session.user._id;
      console.log(productId);
      console.log(userId);
      const proObj = {
        item: ObjectId(productId),
        quantity: 1,
      };

      const userCart = await db
        .get()
        .collection(collection.CART_COLLECTION)
        .findOne({ user: ObjectId(userId) });

      if (userCart) {
        const proExit = userCart.products.findIndex(
          (product) => product.item == productId
        );

        if (proExit != -1) {
          const proExit = await db
            .get()
            .collection(collection.CART_COLLECTION)
            .updateOne(
              { user: ObjectId(userId), "products.item": ObjectId(productId) },
              {
                $inc: { "products.$.quantity": 1 },
              }
            );
        } else {
          const product = await db
            .get()
            .collection(collection.CART_COLLECTION)
            .updateOne(
              { user: ObjectId(userId) },
              {
                $push: {
                  products: proObj,
                },
              }
            );
          res.redirect("/");
        }
      } else {
        const proObj = {
          user: ObjectId(userId),
          products: [{ item: ObjectId(productId), quantity: 1 }],
        };

        const cart = await db
          .get()
          .collection(collection.CART_COLLECTION)
          .insertOne(proObj);
        res.redirect("/");
      }
    } else {
      res.redirect("/User/login");
    }
  } catch (err) {
    console.log(err);
  }
};

exports.removeget = async (req, res) => {
  try {
    const productId = req.query.id;
    console.log("hi");

    console.log(req.session.user);
    console.log(productId, "hhhhhhhhhhhhhhhhhhhhhhhhhh");

    const result = await db
      .get()
      .collection(collection.CART_COLLECTION)
      .updateOne(
        { user: ObjectId(req.session.user._id) },
        {
          $pull: { products: { item: ObjectId(productId) } },
        }
      );
    res.redirect("/user/cart");
  } catch (err) {
    console.log(err);
  }
};

exports.quantitypost = async (req, res) => {
  const cart = req.body.cart;
  const product = req.body.product;
  const count = parseInt(req.body.count);

  try {
    if (req.body.count == -1 && req.body.quantity == 1) {
      const prod = await db
        .get()
        .collection(collection.CART_COLLECTION)
        .updateOne(
          { _id: ObjectId(cart) },
          {
            $pull: { products: { item: ObjectId(product) } },
          }
        );

      req.status = "removeProduct";
    } else {
      const products = await db
        .get()
        .collection(collection.CART_COLLECTION)
        .updateOne(
          { _id: ObjectId(cart), "products.product_Id": ObjectId(product) },
          {
            $inc: { "products.$.quantity": count },
          }
        );

      req.status = true;
    }
    next();
  } catch (err) {
    console.log(err);
  }
};

exports.placeorder = async (req, res) => {
  try {
    const userId = req.session.user._id;

    const total = await db
      .get()
      .collection(collection.CART_COLLECTION)
      .aggregate([
        {
          $match: {
            user: ObjectId(userId),
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
        {
          $group: {
            _id: null,
            total: { $sum: { $multiply: ["$quantity", "$products.price"] } },
          },
        },
      ])
      .toArray();

    // =======================================================================================================

    const address = await db
      .get()
      .collection(collection.USER_COLLECTION)
      .find()
      .toArray();

    res.render("User/place-order", {
      navside: true,
      total: total[0].total,
      user: req.session.user,
      address: address[0].address,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.placeorderpost = async (req, res) => {
  try {
    const productId = req.query._id;
    const userId = req.session.user._id;
    const aggr = [
      {
        $match: {
          _id: ObjectId(userId),
        },
      },
      {
        $unwind: {
          path: "$address",
        },
      },
      {
        $match: {
          "address._id": ObjectId(req.body.Address),
        },
      },
    ];
    const addressDetails = await db
      .get()
      .collection(collection.USER_COLLECTION)
      .aggregate(aggr).toArray();
console.log(addressDetails);
    const agg = [
      {
        $match: {
          user: ObjectId(userId),
        },
      },
      {
        $unwind: {
          path: "$products",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          productId: "$products.item",
          quantity: "$products.quantity",
        },
      },
      {
        $lookup: {
          from: collection.PRODUCT_COLLECTION,
          localField: "productId",
          foreignField: "_id",
          as: "result",
        },
      },
      {
        $unwind: {
          path: "$result",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          productId: 1,
          quantity: 1,
          result: 1,
        },
      },
      {
        $group: {
          _id: "$_id",
          products: {
            $push: {
              _id: "$result._id",
              productName: "$result.product",
              quantity: "$quantity",
              description: "$result.description",
              category: "$result.category",
              price: "$result.price",
            },
          },
        },
      },
    ];

    const products = await db
      .get()
      .collection(collection.CART_COLLECTION)
      .aggregate(agg)
      .toArray();

    const total = await db
      .get()
      .collection(collection.CART_COLLECTION)
      .aggregate([
        {
          $match: {
            user: ObjectId(userId),
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
        {
          $group: {
            _id: null,
            total: { $sum: { $multiply: ["$quantity", "$products.price"] } },
          },
        },
      ])
      .toArray();

    const order = req.body;
    console.log(order);
    console.log(total[0].total);
    console.log(products[0].products);

    const status = order.payment === "COD" ? "placed" : "pending";
    const obj = new ObjectId();

    const orderObj = {
      userId: ObjectId(order.userId),
      payment: order.payment,
      products: products[0].products,
      status: status,
      total: total,
      date: new Date(),
    };

    // const aadres = await db
    //   .get()
    //   .collection(collection.USER_COLLECTION)
    //   .updateOne(
    //     { _id: ObjectId(userId) },
    //     {
    //       $push: {
    //         address: orderObj.deliveryDetails,
    //       },
    //     }
    //   );

    console.log(orderObj);
    const result = await db
      .get()
      .collection(collection.ORDER_COLLECTION)
      .insertOne(orderObj);

    req.session.insertedId = result.insertedId;

    // const removecart = await db
    // .get()
    // .collection(collection.CART_COLLECTION)
    // .deleteOne({user:ObjectId(order.userId)})

    if (req.body.payment == "COD") {
      res.json({ codSuccess: true });

      //============================ Razorpay ================================================
    } else if (req.body.payment === "Razorpay") {
      try {
        const order = await instance.orders.create({
          amount: total[0].total * 100,
          currency: "INR",
          receipt: result.insertedId.toString(),
        });
        res.json({
          order,
        });
      } catch (err) {
        console.log(err);
      }

      // ===================Paypal==========================================================
    } else if (req.body.payment === "Paypal") {
      const cartItems = await db
        .get()
        .collection(collection.CART_COLLECTION)
        .aggregate(agg)
        .toArray();

      let amount = Math.floor(total[0].total / 81.77);

      const create_payment_json = {
        intent: "sale",
        payer: {
          payment_method: "paypal",
        },
        redirect_urls: {
          return_url: "http://localhost:3000/user/success",
          cancel_url: "http://localhost:3000/cancel",
        },
        transactions: [
          {
            item_list: {
              items: [
                {
                  name: "Red Sox Hat",
                  sku: "001",
                  price: amount,
                  currency: "USD",
                  quantity: 1,
                },
              ],
            },
            amount: {
              currency: "USD",
              total: amount,
            },
            description: "hehe",
          },
        ],
      };

      paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
          console.log(error);
          console.log(error.details);
          console.log(payment, "////////////////////////");
        } else {
          for (let i = 0; i < payment.links.length; i++) {
            if (payment.links[i].rel === "approval_url") {
              console.log(payment);
              res.json({ paypal: true, link: payment.links[i].href });
            }
          }
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
};

// ========================paypal=================================================

exports.paypalsuccess = async (req, res) => {
  console.log("dyyyyyyyyyyyyyyyyyyyyyyyyyyyyy");
  try {
    console.log(req.query.paymentId);
    const userId = req.session.user._id;
    console.log(userId);
    const id = req.session.insertedId;
    console.log(id);

    const orderDetails = await db
      .get()
      .collection(collection.ORDER_COLLECTION)
      .findOne({ _id: ObjectId(id) });
    console.log(orderDetails);

    let amount = Math.floor(orderDetails.total[0].total / 81.78);

    var execute_payment_json = {
      payer_id: req.query.PayerID,
      transactions: [
        {
          amount: {
            currency: "USD",
            total: amount,
          },
        },
      ],
    };

    const paymentId = req.query.paymentId;
    paypal.payment.execute(
      paymentId,
      execute_payment_json,
      async function (error, payment) {
        if (error) {
          console.log(error);
        } else {
          const result = await db
            .get()
            .collection(collection.ORDER_COLLECTION)
            .updateOne(
              { _id: ObjectId(id) },
              {
                $set: { status: "placed" },
              }
            );
          console.log(result);
        }
      }
    );
    res.redirect("/user/order-complate");
    req.session.OrderId = null;
  } catch (err) {
    console.log(err);
  }
};

//=================================================verifipayment=========================

exports.paymentVerification = async (req, res) => {
  try {
    const details = req.body;
    
    console.log("heyyyyyyyyyyyy");
    const objId = req.body["order[receipt]"];
    console.log(objId);

    const crypto = require("crypto");
    let hmac = crypto.createHmac("sha256", "r7g6b2ScrJedg3CddhpF3v9x");

    hmac.update(
      details["payment[razorpay_order_id]"] +
        "|" +
        details["payment[razorpay_payment_id]"]
    );
    hmac = hmac.digest("hex");

    if (hmac == details["payment[razorpay_signature]"]) {
      const result = await db
        .get()
        .collection(collection.ORDER_COLLECTION)
        .updateOne(
          { _id: ObjectId(objId) },
          {
            $set: { status: "placed" },
          }
        );

      res.json({ status: true });
    } else {
      console.log("payment failed");
      res.json({ status: false });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.ordercomplate = (req, res) => {
  res.render("user/order-complate", { navside: true });
};

exports.ordersget = async (req, res) => {
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
    .toArray();

    const products = await db
      .get()
      .collection(collection.PRODUCT_COLLECTION)
      .find()
      .toArray();

  res.render("user/orders", { navside: true, orders: orders,products:products });
  console.log(products,'wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww');
};

//========================================== PicUp Address===================
// exports.picupAddress = async (req, res) => {
//   const userId=req.session.user._id
// console.log(req.params.id,'alllllllllllllllllllllllllllllllllp');

//   let address = await db
//   .get()
//   .collection(collection.USER_COLLECTION)
//   .aggregate(
//     [
//         {
//             '$match': {
//                 '_id': objId(userId)
//             }
//         }, {
//             '$unwind': {
//                 'path': '$address'
//             }
//         }, {
//             '$match': {
//                 'address._id': objId(addressId)
//             }
//         }, {
//             '$project': {
//                 'address': 1,
//                 'email': 1,
//                 'username': 1
//             }
//         }
//     ]
// ).toArray()

//       res.json(address)

//       console.log();
//   }

exports.addaddress = async (req, res) => {
  try {
    const order = req.body;
    const userId = req.session.user._id;
    console.log(req.body, "loooolllllfooooooooooooooooosfas");

    const obj = new ObjectId();

    const orderObj = {
      deliveryDetails: {
        _id: ObjectId(obj),
        name: order.name,
        lnam: order.lname,
        address: order.address,
        town: order.town,
        state: order.state,
        zip: Number(order.zip),
        email: order.email,
        phone: Number(order.phone),
      },
    };
    const aadres = await db
      .get()
      .collection(collection.USER_COLLECTION)
      .updateOne(
        { _id: ObjectId(userId) },
        {
          $push: {
            address: orderObj.deliveryDetails,
          },
        }
      );
    res.redirect("back");
  } catch (err) {}
};



exports.statuspost=(req,res)=>{
  console.log('ooooooooooooooooooooooooooooooooooooooo');
console.log(req.body);


}