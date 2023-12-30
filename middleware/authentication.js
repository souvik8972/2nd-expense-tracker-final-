const jwt = require("jsonwebtoken");
const UserDb = require("../model/userDb");
require ("dotenv").config()

const secretKey=process.env.SECRET_KEY

exports.auth= async (request, response, next) => {
    try {
        const authorizationHeader = request.headers.authorization;

        // Checking  the authorization header is present or not present
        if (!authorizationHeader) {
            return response.status(401).json({ message: 'Authorization header is missing' });
        }

        const token = authorizationHeader.split(" ")[1];
        // const token = authorizationHeader
        
      

        // Checking if the token is present or not
        if (!token) {
            return response.status(401).json({ message: 'Token is missing' });
        } else {
            
            const decode = jwt.verify(token, secretKey);
            

            // decode userId from authorization token (jwt token)
            const userId = decode.userId;
             
            const user = await UserDb.findByPk(userId);
            

            // Attach the user to the request for later use that will send to the next request
            request.user = user;
            
            next();
        }
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            response.status(401).json({ message: 'Token expired, please sign in again' });
        } else if (error.name === 'JsonWebTokenError') {
            response.status(401).json({ message: 'Invalid token',error:error });
        } else {
            console.error('Error:', error);
            response.status(500).json({ message: 'Internal Server Error' });
        }
    }
};
