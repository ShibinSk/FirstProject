var db = require("../config/connection");
var collection = require("../config/collection");
const ObjectId = require("mongodb").ObjectId;

exports.catagoryget = async (req, res) => {
  try {
    const category = await db
      .get()
      .collection(collection.CATEGORY_COLLECTION)
      .find()
      .toArray();

    res.render("Admin/catagory", { admin: true, category });
  } catch (err) {
    console.log(err);
  }
};

exports.catagorypost = async (req, res) => {
  try {
    const cat = req.body;
    console.log(cat);
    const categorychecke=req.body.Category
    const catagory = await db
    .get()
    .collection(collection.CATEGORY_COLLECTION)
    .find({ category:{$regex:/categorychecke/i}});
    console.log(catagory,'pppppp');
    console.log(categorychecke,'wwwwwwww');
    if (catagory == null) {
      const category = {
        category: req.body.Category,
      };
      const newcatagory = await db
        .get()
        .collection(collection.CATEGORY_COLLECTION)
        .insertOne(category);
      res.redirect("/admin/category");
    } else {
      res.redirect("/admin/category");
    }
  } catch (err) {
    res.render("error", { navside: true });
  }
};

// =====================================================================================

exports.deletecategoryget = async (req, res) => {
  try {
    const id = req.query.id;
    const category = await db
      .get()
      .collection(collection.CATEGORY_COLLECTION)
      .deleteOne({ _id: ObjectId(id) });

    res.redirect("/Admin/category");
  } catch (err) {
    res.render("error", { navside: true });
  }
};
exports.editcategoryget = async (req, res) => {
  console.log(req.query.id, "sssssssssssssssssssssssssssssss");

  try {
    const id = req.query.id;

    const newcategory = await db
      .get()
      .collection(collection.CATEGORY_COLLECTION)
      .findOne({ _id: ObjectId(id) });

    console.log(newcategory, "kkkkkkkkkk");
    res.render("admin/edit-category", { admin: true, newcategory });
    console.log(newcategory, "kkkkkkkkkk");
  } catch (err) {}
};

exports.editcategorypost = async (req, res) => {
  try {
    const id = req.query.id;

    console.log(req.body);

    console.log(id, "eeeeeeeeeeeeeeeeeeee");

    const category = await db
      .get()
      .collection(collection.CATEGORY_COLLECTION)
      .updateOne(
        { _id: ObjectId(id) },
        {
          $set: {
            category: req.body.Category,
          },
        }
      );
    res.redirect("/admin/category");
  } catch (err) {
    res.render("error", { navside: true });
  }
};
