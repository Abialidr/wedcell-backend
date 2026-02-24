const mongoose = require("mongoose")


const paymentSchema = new mongoose.Schema({
  razorpay_payment_id: { type: String, require: false },
  razorpay_order_id: { type: String, require: false },
  razorpay_signature: { type: String, require: false },
});




module.exports = mongoose.model("razorPayment", paymentSchema)



