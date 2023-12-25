
const express = require("express");
const route = express.Router();

const authController= require("../middleware/authentication")
const premiumFeature=require("../controller/premiumFeatureController")


route.get("/leaderboard",authController.auth,premiumFeature.leaderboard)

route.get("/report",authController.auth,premiumFeature.report)
route.get("/reports",(req, res) =>{
    res.sendFile("report.html",{root:"views"})
})


module.exports=route