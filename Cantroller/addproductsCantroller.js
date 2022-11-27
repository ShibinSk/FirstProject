var db = require("../config/connection");
var collection = require("../config/collection");
const fs = require("fs");
const cloudinary = require("../utils/cloudinary");
const path = require("path");
const multer = require("multer");



var ObjectId = require("mongodb").ObjectId;

exports.viewproductsget = async (req, res) => {
  try {
    const products = await db
      .get()
      .collection(collection.PRODUCT_COLLECTION)
      .find()
      .toArray();

    res.render("Admin/view-products", { admin: true, products });
    console.log(products,'qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq');
  } catch (err) {
    console.log(err);
  }
};

exports.addproductsget = async (req, res) => {
  const category = await db
    .get()
    .collection(collection.CATEGORY_COLLECTION)
    .find()
    .toArray();
  console.log(category, "lllllllllllllllllllllllllll");
  res.render("Admin/add-products", { admin: true, category });
};

exports.addproductspost = async (req, res) => {
  console.log(req.body, req.files);

  try {
    const price = parseInt(req.body.price);
    const quantity = parseInt(req.body.quantity);

    // =========================================================================================================================
    // const cloudinaryImageUploadMethod = (file) => {
    //   return new Promise((resolve) => {
    //     console.log(file)
    //     cloudinary.uploader.upload(file, (err) => {
    //       if (err){ return res.send("upload image error"+err);}
    //       resolve(res.secure_url);
    //     });
    //   });
    // };

    // const files = req.files;
    // let arr1 = Object.values(files);
    // let arr2 = arr1.flat();

    // const urls = await Promise.all(
    //   arr2.map(async (file) => {
    //     const { path } = file;
    //     const result = await cloudinaryImageUploadMethod(path);
    //     return result;
    //   })
    // );
    // console.log(urls);

    console.log(req.files);

    const { image1, image2, image3, image4 } = req.files;

    let urls = [];
    urls.push(image1[0].filename);
    urls.push(image2[0].filename);
    urls.push(image3[0].filename);
    urls.push(image4[0].filename);
    console.log(urls);

    const product = {
      product: req.body.name,
      description: req.body.Description,
      category: req.body.category,
      price: Number(req.body.price),
      quantity: Number(req.body.quantity),
      image: urls,
    };
    console.log(price);
    console.log("hy");

    res.redirect("/Admin/view-products");

    const newProduct = await db
      .get()
      .collection(collection.PRODUCT_COLLECTION)
      .insertOne(product);
    console.log(newProduct.insertedId.toString());
    const id = newProduct.insertedId.toString();
    // let imagearr=[]
    // let image = req.files.Image;
    // image.mv("./public/product-images/" + id + ".jpg", (err) => {
    //   if (!err) {
    //     res.redirect("/Admin/add-products");

    //   } else {
    //     console.log(err);
    //   }
    // });
    res.redirect("/Admin/view-products");
  } catch (err) {
    console.log(err);
  }
};

// ========================================================================================================

exports.deleteget = async (req, res) => {
  try {
    const id = req.params.id;

    // console.log(id);

    const product = await db
      .get()
      .collection(collection.PRODUCT_COLLECTION)
      .deleteOne({ _id: ObjectId(id) });
    res.redirect("/admin/view-products");
  } catch (err) {
    console.log(err);
  }
};

exports.editget = async (req, res) => {
  try {
    const id = req.query.id;

    const product = await db
      .get()
      .collection(collection.PRODUCT_COLLECTION)
      .findOne({ _id: ObjectId(id) });
    console.log(product);

    const category = await db
      .get()
      .collection(collection.CATEGORY_COLLECTION)
      .find()
      .toArray();
    console.log(category, "lllllllllllllllllllllllllll");
    // res.render('Admin/add-products.hbs',{admin:true})
    res.render("Admin/edit-products", {
      admin: true,
      product,
      category: category,
    });
    // res.render()
  } catch (err) {
    console.log(err);
  }
};

exports.editpost = async (req, res) => {
  try {
    const prodetails = req.body;
    const id = req.query.id;
    console.log(req.body);
    console.log(id);
    console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk");

    console.log(req.files);
    const { image1, image2, image3, image4 } = req.files;

    let urls = [];
    urls.push(image1[0].filename);
    urls.push(image2[0].filename);
    urls.push(image3[0].filename);
    urls.push(image4[0].filename);
    console.log(urls);

    const newproduct = await db
      .get()
      .collection(collection.PRODUCT_COLLECTION)
      .updateOne(
        { _id: ObjectId(id) },
        {
          $set: {
            product: req.body.name,
            description: req.body.Description,
            category: req.body.category,
            price: req.body.price,
            image: urls,
          },
        }
      );

    res.redirect("/Admin/view-products");

    // }
  } catch (err) {
    console.log(err);
  }
};
