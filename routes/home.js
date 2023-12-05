const express=require("express")
const route =express.Router()




route.get("/",(req,res)=>{
    res.sendFile("home.html",{root:"views"})
})



module.exports =route