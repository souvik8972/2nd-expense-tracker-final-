const express=require("express")
const route =express.Router()

const controller=require("../controller/homeController")


route.get("/",controller.gethomepage)



module.exports =route