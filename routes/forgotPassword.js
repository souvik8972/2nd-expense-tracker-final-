const express=require("express")
const route=express.Router()
const User=require("../model/userDb")

const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const secret="thisissecret"


var nodemailer = require('nodemailer');



route.get("/forgot-password",(req,res)=>{
    res.sendFile("forgotpassword.html",{root:"views"})
})


route.post("/forgot-password",async(req,res)=>{

   const email=req.body.email;
 
   

    try {
        const oldUser=await User.findOne({
            where:{
                email:email,
            }
        })
        if (!oldUser){
            return res.status(404).json({"message": "User not found"})
        }
        console.log(oldUser.email)
        const token=jwt.sign({email:oldUser.email ,id:oldUser.id},secret,{expiresIn:"10m"})
        const link=`http://localhost:8080/resetpassword/${oldUser.id}/${token}`
        var transporter = nodemailer.createTransport({
            service: 'gmail',
          
            auth: {
                user: 'souvik8582@gmail.com',
                pass: 'udqjuhqsgkofkvgy'
            }
          });
          
          var mailOptions = {
            from: 'souvik8582@gmail.com',
            to: oldUser.email,
            subject: 'Sending Email using Node.js',
            text: link,
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          })
        console.log(link)

       res.status(200).send(link)


    } catch (error) {
        console.log(error)
        res.status(500).json({"message": "Enternal server error"})
        
    }



}

)



route.get("/resetpassword/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  try {
    const oldUser = await User.findOne({
      where: {
        id
      }
    });

    if (!oldUser) {
      return res.status(404).json({ message: "User not found" });
    }

    try {
      console.log(req.body.password)
      const verify =  jwt.verify(token, secret);

      res.status(200).sendFile("changepassword.html",{root:"views"})
     
    } catch (tokenError) {
      return res.status(401).json({ message: "Token verification failed" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

route.post("/resetpassword/:id/:token", async (req, res) => {
    const { id, token } = req.params;
    try {
      const oldUser = await User.findOne({
        where: {
          id
        }
      });
  
      if (!oldUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      try {
        console.log(req.body.password)
        const verify =  jwt.verify(token, secret);
       
  
       const password=req.body.password
       const confirmPassword=req.body.confirmPassword
        
  
        if (password !== confirmPassword) {
          return res.status(400).json({ message: "Password and confirmPassword do not match" });
        }
  
        const hashedPassword = await bcrypt.hash(password, 10);
  
        await User.update(
          {
            password: hashedPassword
          },
          {
            where: {
              id
            }
          }
        );
  
        res.status(200).json({ message: "Password reset successfully" });
      } catch (tokenError) {
        return res.status(401).json({ message: "Token verification failed" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  








module.exports=route