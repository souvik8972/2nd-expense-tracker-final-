const express=require("express")
const route=express.Router()
const User=require("../model/userDb")

const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const secret="thisissecret"





route.get("/forgot-password",(req,res)=>{
    res.sendFile("forgotpassword.html",{root:"views"})
})


route.post("/forgot-password",async(req,res)=>{

   const email="souvik8582@gmail.com"
 
   

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
        console.log(link)

       res.send(link)


    } catch (error) {
        console.log(error)
        res.status(500).json({"message": "Enternal server error"})
        
    }



}

)



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
        console.log(verify)
  
       const password="abc"
       const confirmPassword="abc"
        
  
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
  



// route.post('/reset-password/:id',async (req,res)=>{

//  const id = req.params.id
// const password = req.body.password;
// const confirmPassword=req.body.confirmPassword


// try {
//     if(confirmPassword!==password) {
//         res.status(500).json({"message": "passwords do not match"})
//     }
//     console.log(password)
//     const hashpasswords=await bcrypt.hash(password,10)
//     const upadtedPassword =await User.update({
//         password:hashpasswords
//     },{
//         where:{
//             id:id
//         }
//     }
//     )
//     res.status(200).json({"message":"upadted password"})
    
// } catch (error) {
//     console.log(error)
//     res.send(error)
    
// }




// })
// route.post("/reset-password/:id",(req,res)=>{
//     const id = req.params.id
// const password = req.body.password;
// const confirmPassword=req.body.confirmPassword
// console.log(id,password,confirmPassword)

// })









module.exports=route