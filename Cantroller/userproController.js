const db = require("../config/connection");
const collection = require("../config/collection");
const ObjectId = require("mongodb").ObjectId;

exports.userproget = async (req, res) => {
  try {
    const id = req.session.user._id;
    const users = await db
      .get()
      .collection(collection.USER_COLLECTION)
      .findOne({ _id: ObjectId(id) });

    console.log(users);

    const address = await db
      .get()
      .collection(collection.USER_COLLECTION)
      .find()
      .toArray();

      const walletDetails = await db
      .get()
      .collection(collection.WALLET_COLLECTION)
      .findOne({ userId: ObjectId(req.session.user._id) });
    
    const walletD = walletDetails;

    
      

    res.render("User/userPro", {
      navside: true,
      users: users,
      navside: true,
      user: req.session.user,
      address: address[0].address,
      walletD: walletD.walletAmount,
      walletAmount:walletDetails.transaction
    });
    console.log(walletDetails.transaction,'ppppppppppppppppppppppppppppp');
  } catch (err) {
    console.log(err);
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    console.log(req.query.id);
    const userId = req.session.user._id;
    const id = req.query.id;
    console.log(userId);

    const address = await db
      .get()
      .collection(collection.USER_COLLECTION)
      .updateOne(
        { _id: ObjectId(userId) },
        { $pull: { address: { _id: ObjectId(id) } } }
      );
    





    res.redirect("/user/userPro");
  } catch (err) {
    console.log(err);
  }
};

exports.editaddress = async (req, res) => {
  const id = req.query.id;
  const userId = req.session.user._id;

  const agg = [
    {
      $match: {
        _id: new ObjectId(userId),
      },
    },
    {
      $unwind: {
        path: "$address",
      },
    },
    {
      $match: {
        "address._id": new ObjectId(id),
      },
    },
    {
      $project: {
        address: 1,
      },
    },
  ];
  console.log(agg, "gttttttttttttttt");

  const userdata = await db
    .get()
    .collection(collection.USER_COLLECTION)
    .aggregate(agg)
    .toArray();

  

    
  // Cart count
  // const count = await commonController.getCartCount(req.session.user);
  // res.render("user/wallet", {
  //   active: true,
  //   user: true,
  //   style: "profile",
  //   wallet: "is-active",
  //   walletD,
  //   count,
  // });


  res.render("user/edit-address", { navside: true, userdata ,});
};

exports.posteditaddress = async (req, res) => {
  const addressId = req.query.id;

  console.log(addressId, "aaaaaaaaaaaaaaaaaaaaaaaaaaa");

  console.log(req.body);

  const adrs = await db
    .get()
    .collection(collection.USER_COLLECTION)
    .updateOne(
      { "address._id": ObjectId(addressId) },
      {
        $set: {
          "address.$._id": ObjectId(addressId),
          "address.$.name": req.body.firstname,
          "address.$.lnam": req.body.lastname,
          "address.$.address": req.body.address,
          "address.$.town": req.body.city,
          "address.$.state": req.body.state,
          "address.$.phone": req.body.mobile,
          "address.$.zip": req.body.zip,
          "address.$.email": req.body.email,
        },
      },
      { upsert: true }
    );

  res.redirect("/user/userPro");
};




exports.getwallet=(req,res)=>{
  res.render('User/wallet')
}



exports.updatepro=async(req,res)=>{
  const userId=req.session.user._id
  console.log(userId);
  console.log(req.body);

  const user= await db 
  .get()
  .collection(collection.USER_COLLECTION)
  .updateOne({_id:ObjectId(userId)},{
    $set:{
      Name:req.body.name,
      Email:req.body.email,
      Phone:req.body.mobile
    }
  })
  res.redirect('/User/userPro')

}