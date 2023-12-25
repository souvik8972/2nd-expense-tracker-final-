

const Order = require('../model/orders');
require("dotenv").config()
const RAZORPAY_KEY_ID=process.env.RAZORPAY_KEY_ID
const RAZORPAY_KEY_SECRET=process.env.RAZORPAY_KEY_SECRET
const Razorpay = require('razorpay');

const key_id = RAZORPAY_KEY_ID;
const key_secret =RAZORPAY_KEY_SECRET;
const secretKey=process.env.SECRET_KEY
const jwt=require("jsonwebtoken")

exports.premiummembership = async (request, response, next) => {
    try {
        const rzpInstance = new Razorpay({
            key_id: key_id,
            key_secret: key_secret
        });

        var options = {
            amount: 50000,
            currency: "INR",
        };

        const orderDetails = await rzpInstance.orders.create(options);
        const User = request.user;
        const id = orderDetails.id; // Correct extraction of order ID
        await User.createOrder({
            order_id: id,
            status: "Pending",
        });

        response.status(200).json({ key_id: key_id, order_id: id, user: User });

    } catch (error) {
        console.log(error);
        response.send(error);
    }
};

exports.updatetransactionstatus = async (request, response, next) => {
    const { order_id, payment_id } = request.body;

    try {
        const user = request.user;
        user.ispremiumuser = true;

        await Promise.all([
            user.save(),
            Order.update(
                { payment_Id: payment_id, status: "Successful" }, // Correct attribute name
                { where: { order_id: order_id }}
            ),
        ]);
        const token= jwt.sign({ userId: user.id,name:user.name,ispremiumuser:true}, secretKey, { expiresIn: "5d" })
        response.status(202).json({ success: true, message: "Thank you for being a premium user",token: token});
    } catch (error) {
        console.log(error);
        response.status(500).json({ success: false, message: "Error updating transaction" });
    }
};
