
exports.menget=(req,res)=>{
   
    res.render('User/men',{user:req.session.user})
    
    
}