const jwt = require("jsonwebtoken");
const UserDb = require("../model/userDb");
require('dotenv').config();

const secretKey = "thisissecret";

exports.auth= async (request, response, next) => {
    try {
        const authorizationHeader = request.headers.authorization;

        // Check if the authorization header is present
        if (!authorizationHeader) {
            return response.status(401).json({ message: 'Authorization header is missing' });
        }

        const token = authorizationHeader.split(" ")[1];
        // const token = authorizationHeader
        
      

        // Check if the token is present
        if (!token) {
            return response.status(401).json({ message: 'Token is missing' });
        } else {
            
            const decode = jwt.verify(token, secretKey);
            

            // You can directly access the userId from the decoded payload
            const userId = decode.userId;
             

            // You may want to handle different errors separately
            const user = await UserDb.findByPk(userId);
            

            // Attach the user to the request for later use
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
