var db = require("../config/connection");
var collection = require("../config/collection");

exports.loginget=(req,res)=>{
 
    res.render('Admin/adminHome',{admin:true})
   
}

exports.loginpost=async(req,res)=>{
    try {
       
   
        const Email = "admin@gmail.com";
        const Password = "123";
       
        
        req.session.loggedIn=true
        console.log(req.session.user);
    if (req.body.Email == Email && req.body.Password ==Password) {
        req.session.admin
        
       
       res.render('Admin/dashbord',{admin:true})


    }else{
        const loginErr=('invalid Email or passwoword')
        res.render('Admin/adminLogin',{navside:true, loginErr})

    }
        
    } catch (err) {
        console.log(err);
        
    }
    

   


}