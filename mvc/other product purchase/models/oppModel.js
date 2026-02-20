const mongoose = require("mongoose");

const oppSchema = new mongoose.Schema({
  name: { type: String, require: true },
  number: { type: String, require: true },
  eventDate: { type: String, require: true },
  status: { type: String, enum: ["initiated", "success", "failed"] },
  address: { type: String },
  requirments: { type: String },
  data: {},
  type: { type: String, required: false, trim: true, default: "" },
  totalPayment: { type: Number },
  qauntity: { type: Number },
  discount: { type: Number },
  paidPayment: { type: Number },
  remainingpayment: { type: Number },
  paymentType: { type: String, enum: ["full", "50%", "30%"] },
  payment_id: { type: String },
  vendor_id: { type: String },
  user_id: { type: String },
  type: { type: String, require: true },
});

module.exports = mongoose.model("OtherProductPurchase", oppSchema);
