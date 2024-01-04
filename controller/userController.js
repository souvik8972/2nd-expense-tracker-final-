const User=require("../model/userDb")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
require("dotenv").config()
const secretKey=process.env.SECRET_KEY


                       //get the signup page
exports.getsignUp=(req,res)=>{
    res.sendFile("signup.html",{root:"views"})

}



                          //create a new user
exports.postSignUp=async(req,res)=>{
    const {name,email,password,confirm_password} = req.body;
    
    try {
        //checking user present or not by using email
const user=await User.findAll({
    where:{
        email: email,
    }
})
//if user is not present
    if(user==""){
        //creating a has pasword using bcrypt.hash function and adding solt value of 10
        const hasHpasswords=await bcrypt.hash(password,10);
        //createing a new user
        await User.create({
            name:name,
            email:email,
            password: hasHpasswords,  
        })
//sending status message of successful
    res.status(201).send("successfully created")

    }else{
        //user already present
        res.status(401).send(user)
}

    } catch (error) {
        console.log(error)
        
    }  

}

                             //login page 

exports.getlogin=(req,res)=>{
    res.sendFile("login.html",{root:"views"})
}


                            //post login


exports.postLogin = async(req,res)=>{
    try {
        const {email,password} = req.body
        //checking is user present or not
        const user=await User.findAll({
            where:{
                email:email
            }
        })
        //if user present
        if (user.length==0){
            res.status(404).send("Email not found")
        }else{
           
            //if user present
            //compare password by using bcrypt.compare  user inter password and save password in database
            const passwordEncoded =await bcrypt.compare(password,user[0].password)
            //if matches password
            if (passwordEncoded){
                //creating a token by using jwt.sign() and passing user is ,name ,isprime and that will expire in 5 days
                const token = jwt.sign({ userId: user[0].id,name:user[0].name,ispremiumuser:user[0].ispremiumuser }, secretKey, { expiresIn: "5d" });
    //sending user as response
            res.status(200).json({token:token,user:user[0]})
            }else{
                //password not matched
                res.status(401).send("Invalid user")
            }
        
        
        }
    
    } catch (error) {
        console.log(error);
            res.status(500).send('An error occurred during authentication')
        
    }
    
    
    }
