const express=require("express")
const route =express.Router()
const User=require("../model/userDb")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
require('dotenv').config();

const secretKey=process.env.SECRET_KEY

route.get("/signup",(req,res)=>{
    res.sendFile("signup.html",{root:"views"})
})
route.get("/login",(req,res)=>{
    res.sendFile("login.html",{root:"views"})
})


route.post("/signup",async(req,res)=>{
    const {name,email,password,confirm_password} = req.body;
    
    try {
const user=await User.findAll({
    where:{
        email: email,
    }
})
if(user==""){
    const hasHpasswords=await bcrypt.hash(password,10);
    await User.create({
        name:name,
        email:email,
        password: hasHpasswords 
    })

res.status(201).send("successfully created")

}else{
    res.status(401).send(user)
}


        
    } catch (error) {
        console.log(error)
        
    }
    


})


route.post("/login",async(req,res)=>{
try {
    const {email,password} = req.body
    const user=await User.findAll({
        where:{
            email:email
        }
    })
    if (user.length==0){
        res.status(404).send("Email not found")
    }else{
       

        const passwordEncoded =await bcrypt.compare(password,user[0].password)
        if (passwordEncoded){
            const token = jwt.sign({ userId: user[0].id, email: user[0].email }, secretKey, { expiresIn: "5d" });

        res.status(200).json({token:token,user:user[0]})
        }else{
            res.status(401).send("Invalid user")
        }
    
    
    }





} catch (error) {
    console.log(error);
        res.status(500).send('An error occurred during authentication')
    
}


})
module.exports=route