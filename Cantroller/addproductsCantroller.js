var db = require("../config/connection");
var collection = require("../config/collection");
// const { router } = require("../app");
// const { Collection } = require("mongodb");

var ObjectId = require("mongodb").ObjectId;

exports.viewproductsget = async (req, res) => {
  try {
    const products = await db
      .get()
      .collection(collection.PRODUCT_COLLECTION)
      .find()
      .toArray();
    
    res.render("Admin/view-products", { admin: true, products });
  } catch (err) {
    console.log(err);
  }
};

exports.addproductsget = (req, res) => {
  res.render("Admin/add-products", { admin: true });
};

exports.addproductspost = async (req, res) => {
  try {
   
    // console.log(req.files.Image);

    const product = {
      product: req.body.name,
      description: req.body.Description,
      category: req.body.category,
      price: req.body.price,
    };

    const newProduct = await db
      .get()
      .collection(collection.PRODUCT_COLLECTION)
      .insertOne(product);
    console.log(newProduct.insertedId.toString());
    const id = newProduct.insertedId.toString();

    let image = req.files.Image;
    image.mv("./public/product-images/" + id + ".jpg", (err) => {
      if (!err) {
        res.redirect("/Admin/add-products");
      } else {
        console.log(err);
      }
    });
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
    
    // res.render('Admin/add-products.hbs',{admin:true})
    res.render("Admin/edit-products", { admin: true, product });
    // res.render()
  } catch (err) {
    console.log(err);
  }
};

exports.editpost= async(req,res)=>{
  try {

  
  
    const prodetails=req.body
    console.log(req.body);
    console.log(req.query.id);
   const id=req.query.id;


  
    const  newproduct= await db
    .get()
    .collection(collection.PRODUCT_COLLECTION) 
    .updateOne({_id:ObjectId(id)},{
      $set:{product: req.body.name,
        description: req.body.Description,
        category: req.body.category,
        price: req.body.price,}
    })
   
    res.redirect('/Admin/view-products')
    if(req.files.Image){
      const id=req.query.id;
     let image=req.files.Image
      image.mv("./public/product-images/" + id + ".jpg",)
      
    }
      
    
  } catch (err) {
    console.log(err);
    
  }

}