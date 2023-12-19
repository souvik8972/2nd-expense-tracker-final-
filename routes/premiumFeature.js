
const express = require("express");
const route = express.Router();

const authController= require("../middleware/authentication")
const premiumFeature=require("../controller/premiumFeatureController")


route.get("/leaderboard",authController.auth,premiumFeature.leaderboard)




module.exports=route