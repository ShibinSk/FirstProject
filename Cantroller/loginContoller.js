var db = require("../config/connection");
var collection = require("../config/collection");
var bcrypt = require("bcrypt");
const session = require("express-session");
const { get } = require("../app");


var accountSid = process.env.TWILIO_ACCOUNT_SID; 
var authToken = process.env.TWILIO_AUTH_TOKEN;
console.log(authToken);
const client = require('twilio')(accountSid, authToken);

exports.loginget = (req, res) => {
   if (req.session.loggedIn) {
    res.redirect('/')
    
   } else {
    res.render("User/login", { navside: true,"loginErr":req.session.loginErr });
    req.session.loginErr=false
    
   }
  
 
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
    


      if(userDetails.status == 'block'){
        req.session.loginErr=true
        res.redirect('/User/login')
       
      }


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
  if (req.session.loggedIn) {
    res.redirect('/signup')
    
  } else {
    res.render("User/signup", { navside: true });
    
  }
  
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



exports.logoutget=(req,res)=>{
    req.session.destroy()
    res.redirect('/')
}

exports.otploginget = (req, res) => {
 try {
  const msg = req.session.msg;
  let div;
  if (req.session.msg) {
    div="alert"
    
  } else {
    
  }

  res.render("User/otp-login", { navside: true,message:msg,div,style:"style" });
  req.session.msg=null
  console.log(req.session.msg);
 } catch (err) {
   console.log(err);
 }

};

exports.otppost= async(req,res)=>{
  console.log(req.body);
  console.log(process.env.TWILIO_SERVICE_SID);


  try {
 
    const userExist = await db
      .get()
      .collection(collection.USER_COLLECTION)
      .findOne({ Phone: req.body.mobile });
      console.log(userExist);
    if (userExist) {
      client.verify
        .services(process.env.TWILIO_SERVICE_SID)
        .verifications.create({
          to: `+91${req.body.mobile}`,
          channel: "sms",
        })
        .then((data) => {})
        .catch((err)=>{
          console.log(err);
        })

      req.session.Phone = req.body.mobile;
      // res.redirect("/User/otp");
      res.render("User/otp",{ navside: true})
    } else {
      req.session.msg = "This number is not register";
      res.redirect("/User/otp-login");
    }
  } catch (err) {
    console.log(err);
  }
};

exports.getsubmit= async(req,res)=>{
  
  const msg = req.session.message;
  const mobile = req.session.mobile;

  res.render("user/otp", { navside:true, phoneNumber: mobile, message: msg, style: "style" });
  req.session.message = null;
};

exports.postsubmit= async(req,res)=>{
  try {
  console.log(req.body);
  let mobile = req.session.Phone
  console.log(mobile);
  console.log(req.body.code);

    if (!req.body.code) {
      console.log(req.body.code);
      req.session.message = "Please enter valid OTP";
      res.redirect("/user/otp");
    }

    const data = await client.verify
      .services(process.env.TWILIO_SERVICE_SID)
      .verificationChecks.create({
        to: `+91${req.session.Phone}`,
        code: req.body.code,
      });
      

    if (!data) {
      req.session.message = "Invalid OTP";
      res.redirect("/user/otp-login");
    } else if (data.status === "approved") {
       
      const user = await db
      .get()
      .collection(collection.USER_COLLECTION)
      .findOne({Phone:req.session.Phone})
      console.log(user);
      req.session.user=user;
      req.session.loggedIn = true;
      res.redirect("/");
    } else if (data.status === "pending") {
      req.session.message = "Invalid OTP";
      res.redirect("/user/otp-login");
    } else {
      req.session.message = "Invalid OTP";
      res.redirect("/user/otp-login");
    }
    req.session.phone=null;
  } catch (err) {
    console.log(err);
  }
};








