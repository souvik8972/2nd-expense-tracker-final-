const express=require("express")
const route =express.Router()

const usercontroller=require("../controller/userController")


route.get("/signup",usercontroller.getsignUp)
route.get("/login",usercontroller.getlogin)


route.post("/signup",usercontroller.postSignUp)


route.post("/login",usercontroller.postLogin)


module.exports=route