const jwt=require("jsonwebtoken")
const User=require("../model/userDb")
require("dotenv").config()
const secretKey=process.env.SECRET_KEY


exports.authorization = async(request,response,next)=>{
    try {
        const token = request.headers.authorization;
        const decode = jwt.verify(token,secretKey);
        console.log(decode)
        const user = await User.findByPk(decode.userId);
        request.user = user;
        next();
        
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            response.status(401).json({ message: 'Time out please sign in' });
        } else {
            console.log('Error:', error);
            response.status(500).json({ message: 'Internal Server Error' });
        }
    }
}