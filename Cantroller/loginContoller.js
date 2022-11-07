var db = require("../config/connection");
var collection = require("../config/collection");
var bcrypt = require("bcrypt");
const { get } = require("../app");

exports.loginget = (req, res) => {
   
  
  res.render("User/login", { navside: true,"loginErr":req.session.loginErr });
  req.session.loginErr=false
};

exports.loginpost = async (req, res) => {
  try {
    console.log(req.body);
    const userData=req.body
    const userDetails = await db
      .get()
      .collection(collection.USER_COLLECTION)
      .findOne({ Name: req.body.username });
      console.log(userDetails);

    if (userDetails) {
    
      const status = await bcrypt.compare(
        req.body.password,
        userDetails.Password
      );
      
      console.log(status);
      if (status) {
        req.session.user=userDetails;
        req.session.loggedIn=true
        console.log(req.session.use);
        res.redirect('/')
       
    
        console.log("done");
      } else {
        req.session.loginErr=true

        res.redirect('/User/login')
        console.log("fail");
       
        
      }
    } else {
        req.session.loginErr=true
        
      console.log("faill");
      res.redirect('/User/login')
    }

    
  } catch (err) {
    console.log(err);
  }
};

// ==========================================================================================

exports.signinget = (req, res) => {
  res.render("User/signup", { navside: true });
};

exports.signuppost = async (req, res) => {
  console.log(req.body);
 
  try {
    const userDetails = {
      Name: req.body.username,
      Email: req.body.Email,
      Phone: req.body.Phone,
      Password: req.body.password,
      status:'active'
    };
    userDetails.Password = await bcrypt.hash(req.body.password, 10);
    console.log(userDetails);
    const users = await db
      .get()
      .collection(collection.USER_COLLECTION)
      .insertOne(userDetails);

    res.render("User/login", { navside: true });
  } catch (err) {
    console.log(err);
  }
};

exports.otpget = (req, res) => {
  res.render("User/otp", { navside: true });
};

exports.logoutget=(req,res)=>{
    req.session.destroy()
    res.redirect('/')
}