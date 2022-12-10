const db = require("../config/connection");
const collection = require("../config/collection");
const { get } = require("../app");
const ObjectId = require("mongodb").ObjectId;

exports.getoffer = async (req, res) => {
  try {
    const category = await db
      .get()
      .collection(collection.CATEGORY_COLLECTION)
      .find()
      .toArray();

    const products = await db
      .get()
      .collection(collection.PRODUCT_COLLECTION)
      .aggregate([
        {
          $project: {
            _id: 1,
            product: 1,
            // category:1,
            // orginalprice:1,
            // discountprice:1,
            // productOffer:1,
            // categoryOffer:1
          },
        },
      ])
      .toArray();
    const disproduct = await db
      .get()
      .collection(collection.PRODUCT_COLLECTION)
      .aggregate([
        {
          $match: {
            productOffer: { $gt: 1 },
          },
        },
        {
          $project: {
            _id: 1,
            product: 1,
            productOffer: 1,
          },
        },
      ])
      .toArray();
    console.log(disproduct, "111111111111111111111111111111111");

    const discategory = await db
      .get()
      .collection(collection.CATEGORY_COLLECTION)
      .aggregate([
        {
          $match: {
            categoryOffer: { $gt: 0 },
          },
        },
        {
          $project: {
            _id: 1,
            category: 1,
            categoryOffer: 1,
          },
        },
      ])
      .toArray();
    console.log(discategory.category, "lllllllll");

    res.render("Admin/offer", {
      admin: true,
      category,
      products,
      disproduct,
      discategory,
    });
  } catch (err) {}
};

exports.addoffer = async (req, res) => {
  console.log(req.body);
  try {
    if (req.body.category && req.body.categoryOffer) {
      const disc = Number(req.body.categoryOffer);

      const id = req.body.category;

      const pro = await db
        .get()
        .collection(collection.PRODUCT_COLLECTION)
        .updateMany(
          { category: id },
          {
            $set: {
              categoryOffer: disc,
            },
          }
        );

        const prod = await db
        .get()
        .collection(collection.CATEGORY_COLLECTION)
        .updateMany(
          { category: id },
          {
            $set: {
              categoryOffer: disc,
            },
          }
        );

      const products = await db
        .get()
        .collection(collection.PRODUCT_COLLECTION)
        .find({ category: id })
        .toArray();
      console.log(products, "pppppppppppppppppp");

      const updateProduct = await products.map(async (prod) => {
        // console.log(prod);
        let disc;
        if (prod.categoryOffer > prod.productOffer) {
          console.log(prod.orginalprice);
          console.log(prod.categoryOffer);

          console.log(
            prod.orginalprice - (prod.orginalprice * prod.categoryOffer) / 100
          );
          disc =
            prod.orginalprice - (prod.orginalprice * prod.categoryOffer) / 100;
          console.log(disc);
          prod.discountprice = Math.ceil(disc);
          console.log(disc, "ooooooooooooooooooooooooooooooooooo");
        } else {
          disc =
            prod.orginalprice - (prod.orginalprice * prod.productOffer) / 100;
          prod.discountprice = Math.ceil(disc);
        }

        return await db
          .get()
          .collection(collection.PRODUCT_COLLECTION)
          .updateOne({ _id: ObjectId(prod._id) }, { $set: prod });
      });
      res.redirect("back");
    } else if (req.body.product && req.body.productOffer) {
      const id = req.body.product;
      const disc = Number(req.body.productOffer);

      await db
        .get()
        .collection(collection.PRODUCT_COLLECTION)
        .updateOne(
          { _id: ObjectId(id) },
          {
            $set: {
              productOffer: disc,
            },
          }
        );
      const pro = await db
        .get()
        .collection(collection.PRODUCT_COLLECTION)
        .findOne({ _id: ObjectId(id) });

      console.log(pro, "///////////////////");
      let price;
      console.log(pro.productOffer, "productOffer");
      console.log(pro.orginalprice, "orginal");
      if (pro.productOffer > pro.categoryOffer) {
        console.log(pro.orginalprice, pro.productOffer);
        price = pro.orginalprice - (pro.orginalprice * pro.productOffer) / 100;

        console.log(price, "88888888888888888888");
      } else {
        console.log(pro.orginalprice, pro.productOffer);
        price = pro.orginalprice - (pro.orginalprice * pro.categoryOffer) / 100;
      }
      const disprice = Math.ceil(price);
      console.log(disprice, "11111111111111111111111");
      await db
        .get()
        .collection(collection.PRODUCT_COLLECTION)
        .updateOne(
          { _id: ObjectId(id) },
          { $set: { discountprice: disprice } }
        );

      res.redirect("back");
    }

    console.log(req.body);
  } catch (err) {
    res.render("error", { navside: true });
  }
};

// ==============delete prodduct offer===========================
exports.deleteoffer = async (req, res) => {
  try {
    const id = req.params.id;

    await db
      .get()
      .collection(collection.PRODUCT_COLLECTION)
      .updateOne(
        { _id: ObjectId(id) },
        {
          $set: {
            productOffer: 0,
          },
        }
      );

    const product = await db
      .get()
      .collection(collection.PRODUCT_COLLECTION)
      .findOne({ _id: ObjectId(id) });
    console.log(product);

    const amount = Math.ceil(
      product.orginalprice - (product.orginalprice * product.productOffer) / 100
      );
      console.log(amount,'qqqqqqqqqqqqqqqqqqq')
    await db
      .get()
      .collection(collection.PRODUCT_COLLECTION)
      .updateOne(
        { _id: ObjectId(id) },
        {
          $set: { discountprice: amount },
        }
      );

    res.redirect("back");
  } catch (err) {
    res.render("error", { navside: true });
  }
};

// ===================delete category offer =============================

exports.deletecategoryoffer = async (req, res) => {
  try {
    
    
    const cat = req.params.category
    const resultl = await db
    .get()
    .collection(collection.PRODUCT_COLLECTION)
    .updateMany(
      {category:cat},
      {
        $set: {categoryOffer: 0 },
      }
    );

    const result = await db
      .get()
      .collection(collection.CATEGORY_COLLECTION)
      .updateMany(  
        { category: cat },
        {
          $set: { categoryOffer: 0 },
        }
      );


    console.log(result, "jjjjjjjjjjjjjjjjjjj");

    
    const product = await db
      .get()
      .collection(collection.PRODUCT_COLLECTION)
      .find({category: cat }).toArray()
      console.log(product, "777777777777777777");

    
      const amount = Math.ceil(
        product.orginalprice - (product.orginalprice * product.productOffer) / 100
        );
    console.log(amount,'aaaaaaaaaaaaaaaaaaaammmmmmmmmmmmm');

    await db
      .get()
      .collection(collection.PRODUCT_COLLECTION)
      .updateOne(
        { category: cat  },
        {
          $set: {
            discountprice: amount,
          },
        }
      ).toArray()
      res.redirect("back");
  } catch (err) {
    res.render("error", { navside: true });
  }
};
