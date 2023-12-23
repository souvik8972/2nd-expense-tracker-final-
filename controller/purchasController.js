

const Order = require('../model/orders');
require("dotenv").config()
const Razorpay = require('razorpay');

const key_id = "rzp_test_FQUGalowc8Wx10";
const key_secret ="GGlxuOFmXDq2TxXymELHWKht";
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

        response.status(202).json({ success: true, message: "Thank you for being a premium user",token: jwt.sign({ userId: user.id,name:user.name,ispremiumuser:true}, secretKey, { expiresIn: "5d" }) });
    } catch (error) {
        console.log(error);
        response.status(500).json({ success: false, message: "Error updating transaction" });
    }
};
