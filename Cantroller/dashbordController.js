var db = require("../config/connection");
var collection = require("../config/collection");
const { payment } = require("paypal-rest-sdk");
const { CallPage } = require("twilio/lib/rest/insights/v1/call");
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
      .aggregate()
      .toArray();
    console.log(orderstatus, "ooooooooooooooooooopppppppppppppp");

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
      .find({ status: "shipped" })
      .count();

    const orderpending = await db
      .get()
      .collection(collection.ORDER_COLLECTION)
      .find({ status: "pending" })
      .count();

    const ordercanceled = await db
      .get()
      .collection(collection.ORDER_COLLECTION)
      .find({ status: "canceled" })
      .count();

    const orderplaced = await db
      .get()
      .collection(collection.ORDER_COLLECTION)
      .find({ status: "placed" })
      .count();

    const orderdeliverd = await db
      .get()
      .collection(collection.ORDER_COLLECTION)
      .find({ status: "delivered" })
      .count();

    const orderrdeliverd = await db
      .get()
      .collection(collection.ORDER_COLLECTION)
      .aggregate([
        {
          $match: {
            status: "delivered",
          },
        },
        {
          $group:{
            _id:null,
            total:{$sum:'$totalAmountDiscounted'}
          }
        }
      ]).toArray()

    const orderReturned = await db
      .get()
      .collection(collection.ORDER_COLLECTION)
      .find({ status: "Returned" })
      .count();

    console.log(orderrdeliverd[0]?.total);
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
      orderplaced,
      orderdeliverd,
      orderReturned,
      orderrdeliverd:orderrdeliverd[0]?.total
    });
  } catch (err) {
    console.log(err);
  }
};

// ===================Sales report ================

exports.getsales = async (req, res) => {
  try {
    const agg = [
      {
        $match: {
          status: "delivered",
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
          _id: 0,
          date: "$newdate",
          productsName: "$products.productName",
          quantity: "$products.quantity",
          price: "$totalAmountOriginal",
          discountPrice: "$totalAmountDiscounted",
        },
      },
    ];

    // const data = await db
    //   .get()
    //   .collection(collection.ORDER_COLLECTION)
    //   .find()
    //   .toArray();

    console.log(req.query);
    let dbQuery = {};

    if (req.query.from) {
      const from = req.query.from;
      const to = req.query.to;
      const fromDate = new Date(from);
      console.log(fromDate);
      const toDate = new Date(to);
      console.log(toDate);
      // let fromdate = req.query.daterange;
      // fromdate = fromdate.split("-");
      // console.log(fromdate);
      // let [from, to] = fromdate;
      // from = from.trim("");
      // to = to.trim("");
      // from = new Date(new Date(from).getTime() + 3600 * 24 * 1000);
      // to = new Date(new Date(to).getTime() + 3600 * 24 * 1000);
      // console.log(from);
      // console.log(to);

      dbQuery = { $match: { date: { $gte: fromDate, $lt: toDate } } };
      agg.unshift(dbQuery);
    } else if (req.query?.month) {
      console.log(req.query.month);
      let month = req.query.month.split("-");
      let [yy, mm] = month;
      console.log(mm, yy);
      let dd = "1";
      let de = "30";
      let fromDate = mm.concat("/", dd, "/", yy);
      console.log(fromDate);
      let fromD = new Date(new Date(fromDate).getTime() + 3600 * 24 * 1000);
      let todate = mm.concat("/", de, "/", yy);
      console.log(todate);
      let toD = new Date(new Date(todate).getTime() + 3600 * 24 * 1000);
      console.log(fromD);
      console.log(toD);

      dbQuery = { $match: { date: { $gte: fromD, $lte: toD } } };
      agg.unshift(dbQuery);
    }
    //query to find the report
    const salesDetails = await db
      .get()
      .collection(collection.ORDER_COLLECTION)
      .aggregate(agg)
      .sort({
        _id: -1,
      })
      .toArray();
    console.log(salesDetails, "pop");

    // console.log(salesDetails);
    //     let priceTotal = salesDetails.reduce((e, element) => {
    //       return e + element.price;
    //     }, 0);
    //     console.log(priceTotal);
    res.render("Admin/sales", { admin: true, salesDetails });
  } catch (err) {
    console.log(err);
  }
};

// exports.getreport=(req,res)=>{
