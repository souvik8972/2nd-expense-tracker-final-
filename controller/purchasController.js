

const Order = require('../model/orders');
require("dotenv").config()
const RAZORPAY_KEY_ID=process.env.RAZORPAY_KEY_ID
const RAZORPAY_KEY_SECRET=process.env.RAZORPAY_KEY_SECRET
const Razorpay = require('razorpay');

const key_id = RAZORPAY_KEY_ID;
const key_secret =RAZORPAY_KEY_SECRET;
const secretKey=process.env.SECRET_KEY
const jwt=require("jsonwebtoken")

                //premiummembership


exports.premiummembership = async (request, response, next) => {
    try {
        //create a new instance of razorpay
        const rzpInstance = new Razorpay({
           
            key_id: key_id,// Set Razorpay key ID
            key_secret: key_secret // Set Razorpay key secret
        });
        //static price for memberships
        var options = {
            amount: 50000,
            currency: "INR",
        };
        // Create an order with Razorpay
        const orderDetails = await rzpInstance.orders.create(options);
        const User = request.user;
        const id = orderDetails.id; // Correct extraction of order ID
       
        // Create an order for the user
        await User.createOrder({
            order_id: id,
            status: "Pending",
        });
         // Send response with Razorpay key ID, order ID, and user details
        response.status(200).json({ key_id: key_id, order_id: id, user: User });

    } catch (error) {
        console.log(error);
        response.send(error);
    }
};

        // Controller for updating transaction status

exports.updatetransactionstatus = async (request, response, next) => {
    const { order_id, payment_id } = request.body;

    try {
        const user = request.user;
        user.ispremiumuser = true;// Set user as a premium user

         // Update user and order status in parallel
        await Promise.all([
            //save change of user status (here ispremiumuser is true)
            user.save(),
            // Update Order status
            Order.update(
                { payment_Id: payment_id, status: "Successful" }, 
                { where: { order_id: order_id }}
            ),
        ]);
        //generate new token for prime user account
        const token= jwt.sign({ userId: user.id,name:user.name,ispremiumuser:true}, secretKey, { expiresIn: "5d" })
        //sending token to frontend
        response.status(202).json({ success: true, message: "Thank you for being a premium user",token: token});
    } catch (error) {
        console.log(error);
        response.status(500).json({ success: false, message: "Error updating transaction" });
    }
};
