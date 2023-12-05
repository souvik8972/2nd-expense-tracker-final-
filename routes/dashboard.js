const express=require("express")
const route =express.Router()




route.get("/dashboard",(req,res)=>{
    res.sendFile("dashboard.html",{root:"views"})
})



module.exports =route