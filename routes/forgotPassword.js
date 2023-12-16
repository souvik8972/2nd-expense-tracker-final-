const express=require("express")
const route=express.Router()

const passworDcontroller=require("../controller/forgotpasswordController")

route.get("/forgot-password",passworDcontroller.forgotPasswordGet)

route.post("/forgot-password",passworDcontroller.forgotPasswordPost)

route.get("/resetpassword/:id/:token",passworDcontroller.resetPasswordGet);

route.post("/resetpassword/:id/:token",passworDcontroller.resetPasswordPost );
  








module.exports=route