exports.gethomepage=(req,res)=>{
    res.sendFile("home.html",{root:"views"})
}