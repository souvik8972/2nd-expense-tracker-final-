
const Order = require('../model/orders');
const dotenv = require('dotenv');
const Razorpay = require('razorpay');
dotenv.config();
const key_id = "rzp_test_O8qmPsOVAIVA4D";
const key_secret ="mqiCklMQlUOssbAmomX9Vxcl";


exports.premiummembership = async (request, response, next) => {
    try {
        const rzpintance = new Razorpay({
            key_id: key_id,
            key_secret: key_secret
        })
        var options = {
            amount: 50000,
            currency: "INR",
        };
        const orderDetails = await rzpintance.orders.create(options);
        const User = request.user;
        const { id} = orderDetails;
        await User.createOrder({
            order_id: id,
            status: "Pending",
        })
        response.status(200).json({ key_id: key_id, order_id: id, user: User });

    } catch (error) {
        console.log(error);
    }
}
exports.updatetransactionstatus = async (request, response, next) => {
    const { order_id, payment_id } = request.body;

    try {
        const user = request.user;
        user.ispremiumuser = true;
        await Promise.all([
            user.save(),
            Order.update(
                { paymentid: payment_id, status: "Successful" },
                { where: { order_id: order_id }}
            )
        ])
        response.status(202).json({ success: true, message: "Thank youfor being a premium user" });
    } catch (error) {
        console.log(error);
        response.status(500).json({ success: false, message: "Error updating transaction" });
    }
}