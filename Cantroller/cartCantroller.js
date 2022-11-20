var db = require("../config/connection");
var collection = require("../config/collection");
const { CallPage } = require("twilio/lib/rest/insights/v1/call");
const { get, response } = require("../app");
const ObjectId = require("mongodb").ObjectId;
const Razorpay = require("razorpay");

var instance = new Razorpay({
  key_id: "rzp_test_RF0nTXmxHqKSxA",
  key_secret: "r7g6b2ScrJedg3CddhpF3v9x",
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
  console.log(cart);

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
    console.log(userId);

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
    console.log(total[0].total);

    // =======================================================================================================

    const address = await db
      .get()
      .collection(collection.ADDRESS_COLLETION)
      .find()
      .toArray();

    res.render("User/place-order", {
      navside: true,
      total: total[0].total,
      user: req.session.user,
      address: address,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.placeorderpost = async (req, res) => {
  try {
    const productId = req.query._id;
    const userId = req.session.user._id;

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

    const orderObj = {
      deliveryDetails: {
        name: order.name,
        lnam: order.lname,
        address: order.address,
        town: order.town,
        state: order.state,
        zip: Number(order.zip),
        email: order.email,
        phone: Number(order.phone),
      },

      userId: ObjectId(order.userId),
      payment: order.payment,
      products: products[0].products,
      status: status,
      total: total,
      date: new Date(),
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

    const address = await db
      .get()
      .collection(collection.ADDRESS_COLLETION)
      .insertOne(orderObj.deliveryDetails);

    console.log(orderObj);
    const result = await db
      .get()
      .collection(collection.ORDER_COLLECTION)
      .insertOne(orderObj);
      console.log(result);

    // const removecart = await db
    // .get()
    // .collection(collection.CART_COLLECTION)
    // .deleteOne({user:ObjectId(order.userId)})
    req.session.OrderId = order.userId.toString();
    if (req.body.payment == "COD") {
      res.json({ codSuccess: true });
    } else if (req.body.payment === "Razorpay") {
      try {
        const OrderId = req.session.OrderId;

        const order = await instance.orders.create({
          amount: total[0].total*100,
          currency: "INR",
          receipt: result.insertedId.toString(),
        });
        res.json({
          
          order,
        });
        console.log(order);
      } catch (err) {
        console.log(err);
      }
    }
  } catch (err) {
    console.log(err);
  }
};


//=================================================verifipayment=========================

exports.paymentVerification= async(req,res)=>{
    
  try {
      const details= req.body
      console.log(req.body);
      console.log('heyyyyyyyyyyyy');
      const objId = req.body["order[receipt]"];
      console.log(objId);
  
  
      const crypto=require('crypto');
      let hmac=crypto.createHmac('sha256','r7g6b2ScrJedg3CddhpF3v9x')
  
      hmac.update(
          details["payment[razorpay_order_id]"] +
            "|" +
            details["payment[razorpay_payment_id]"]
        );
        hmac=hmac.digest('hex')
  
        if(hmac==details['payment[razorpay_signature]']){
          const result = await db
          .get()
          .collection(collection.ORDER_COLLECTION)
          .updateOne(
            { _id: ObjectId(objId) },
            {
              $set: {status: "Confirmed" },
            }
          );
          console.log(result);
          res.json({ status: true });
  
        }else{
          console.log("payment failed");
          res.json({ status: false });
        }
  
  
      
  } catch (err) {
      console.log(err);
      
  }
  
  
  }
  







exports.ordercomplate = (req, res) => {
  res.render("user/order-complate", { navside: true });
};

exports.ordersget = async (req, res) => {
  const orders = await db
    .get()
    .collection(collection.ORDER_COLLECTION)
    .find()
    .toArray();

  res.render("user/orders", { navside: true, orders: orders });
};
