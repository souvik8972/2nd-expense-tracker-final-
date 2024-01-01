const User=require("../model/userDb")
const uuid=require("uuid");
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
require("dotenv").config()
const Forgotpassword=require("../model/forgotpasswordDb")
var nodemailer = require('nodemailer');
const NODE_MAILER_EMAIL=process.env.NODE_MAILER_EMAIL
const NODE_MAILER_PASSWORD=process.env.NODE_MAILER_PASSWORD
const secret=process.env.SECRET_KEY




exports.forgotPasswordGet=(req,res)=>{
    res.sendFile("forgotpassword.html",{root:"views"})
}



exports.forgotPasswordPost=async(req,res)=>{

    const email=req.body.email;
  
    
 
     try {
      //finding that user present or not present
         const oldUser=await User.findOne({
             where:{
                 email:email,
             }
         })
         //if not present then 
         if (!oldUser){
             return res.status(404).json({"message": "User not found"})
         }
         //if present then
        const id=uuid.v4()
        //create a in db using uuid.v4() for unique id
         await oldUser.createForgotpassword({
            id:id,
            isActive:true
         })
         //also creating a jwt token for more secure authentication
         const token=jwt.sign({email:oldUser.email ,id:oldUser.id},secret,{expiresIn:"10m"})
         //sending the link with uuid and token 
         const link=`http://localhost:8080/resetpassword/${id}/${token}`

         //createing a transporter using nodemailer
         var transporter = nodemailer.createTransport({
             service: 'gmail',
           
             auth: {
                 user: NODE_MAILER_EMAIL,//user Email
                 pass: NODE_MAILER_PASSWORD //user Email password
             }
           });
           
           //creating a option for interface of the mail
           var mailOptions = {
             from: 'souvik8582@gmail.com',
             to: oldUser.email,
             subject: 'Expense Buddy Reset password mail',
             
             text:" reset your password",
             html:`<p> reset your password</p>
             <a href=${link}>Reset password</a>`,
           };
           
           //sending mail
           transporter.sendMail(mailOptions, function(error, info){
             if (error) {
               console.log(error);
             } else {
               console.log('Email sent: ' + info.response);
             }
           })
        
           //sending response of successful
        res.status(200).send(link)
 
 
     } catch (error) {
         console.log(error)
         res.status(500).json({"message": "Enternal server error"})
         
     }
 
 
 
 }




 exports.resetPasswordGet= async (req, res) => {
    const { id, token } = req.params;
  
    try {
      const forgotpassword= await Forgotpassword.findOne({
            where:{
                id: id,
                isActive:true,
            }
        })
        if(!forgotpassword){
            return res.status(401).send(`<html>
          <h1>Link expired</h1>
              <a href="/">home</a>
          </html>`)
        }
       await forgotpassword.update({
            isActive:false
        })
        
        
           
        
            try {
             
              const verify =  jwt.verify(token, secret);
        
              res.status(200).sendFile("changepassword.html",{root:"views"})
             
            } catch (tokenError) {
              return res.status(401).json({ message: "expied token" });
            }
          } catch (error) {
            res.status(500).json({ error: error.message });
          }
    

    
  }






  exports.resetPasswordPost = async (req, res) => {
    const { id, token } = req.params;
  
    try {
      const forgotpassword = await Forgotpassword.findOne({
        where: {
          id,
        },
      });
  
      if (!forgotpassword) {
        return res.status(404).json({ message: "Reset entry not found" });
      }
  
      const oldUser = await User.findOne({
        where: {
          id: forgotpassword.UserId,
        },
      });
  
      if (!oldUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      try {
        // console.log("Received Token:", token);
        const verify = jwt.verify(token, secret);
        // console.log("Decoded Token:", verify);
  
        const password = req.body.password;
        const confirmPassword = req.body.confirmPassword;
  
        if (password !== confirmPassword) {
          return res.status(400).json({ message: "Password and confirmPassword do not match" });
        }
  
        const hashedPassword = await bcrypt.hash(password, 10);
  
        await User.update(
          {
            password: hashedPassword,
          },
          {
            where: {
              id: oldUser.id,
            },
          }
        );
  
        res.status(200).json({ message: "Password reset successfully" });
      } catch (tokenError) {
        console.error("Token Verification Error:", tokenError);
        return res.status(401).json({ message: "Token verification failed" });
      }
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ error: error.message });
    }
  };
  
  