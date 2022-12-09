var db = require("../config/connection");
var collection = require("../config/collection");
var bcrypt = require("bcrypt");
const session = require("express-session");
const { get } = require("../app");
const swal=require('sweetalert2')


var accountSid = process.env.TWILIO_ACCOUNT_SID; 
var authToken = process.env.TWILIO_AUTH_TOKEN;
console.log(authToken);
const client = require('twilio')(accountSid, authToken);

exports.loginget = (req, res) => {
   if (req.session.loggedIn) {
    res.redirect('/')
    
   } else {
    if(req.session.userBlock) {
      req.session.userBlock = false
      res.render("User/login", { navside: true,"loginErr":req.session.loginErr , userBlock: true, footersid:true});
    } else {
      res.render("User/login", { navside: true,"loginErr":req.session.loginErr , userBlock: false,footersid:true });
    }
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
      console.log(userDetails);
      if(userDetails.status == 'block'){
        req.session.userBlock=true,
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

  const msg =req.session.err
  if (req.session.loggedIn) {
    res.redirect('/signup')
    
  } else {
    res.render("User/signup", { navside: true,message:msg ,footersid:true});
    req.session.err=null
    
  }
  
};

exports.signuppost = async (req, res) => {
  console.log(req.body);
  console.log("hhhhhhhhhhhhhhh");
  if(
    !req.body.username ||
    !req.body.Email ||
    !req.body.Phone ||
    !req.body.password
  ){
    req.session.err='All fields required'
    res.redirect('/User/signup')
  }else

 
  try {


    const userDetails = {
      Name: req.body.username,
      Email: req.body.Email,
      Phone: req.body.Phone,
      Password: req.body.password,
      status:'active',
      
    }
    userDetails.Password = await bcrypt.hash(req.body.password, 10);
    console.log(userDetails);
    const users = await db
      .get()
      .collection(collection.USER_COLLECTION)
      .insertOne(userDetails);

    res.render("User/login", { navside: true });
  } catch (err) {
    res.render('error',{navside:true});
  }
};



exports.logoutget=(req,res)=>{
    req.session.destroy()
    res.redirect('/User/login')
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
  res.render('error',{navside:true});
 }

};

exports.otppost= async(req,res)=>{
  console.log(req.body,'pppppppppppppppppppppppppppp');
  const mobile= req.session.mobile=req.body;
  console.log(req.session.mobile,'yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy');
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
    res.render('error',{navside:true});
  }
};

exports.getsubmit= async(req,res)=>{
  console.log(req.body,'tttttttttttttttttttttttttttttttttt');
  
  const msg = req.session.message;
  const mobile = req.session.mobile;
  console.log(mobile,'1111111111111111111111');

  res.render("user/otp", { navside:true, phoneNumber: mobile, message: msg, style: "style" });
  req.session.message = null;
};




exports.resentotp=(req,res)=>{
  try {
    console.log(req.session.mobile,'21333233');
    client.verify
    .services(process.env.TWILIO_SERVICE_SID)
    .verifications.create({
      to: `+91${7034928633}`,
      channel: "sms",
    })
    .then((data) => {})
    .catch((err)=>{
      console.log(err);
    })

  req.session.Phone = req.body.mobile;
  res.redirect("/user/otp");
  } catch (err) {
    res.render('error',{navside:true});
  }
}

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
    res.render('error',{navside:true});
  }
};








