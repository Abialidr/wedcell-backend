const mongoose = require("mongoose");

const otherSchema = new mongoose.Schema({
  name: { type: String, require: true },
  number: { type: String, require: true },
  eventDate: { type: String, require: true },
  slot: { type: String, enum: ["Morning", "Evening"] },
  status: { type: String, enum: ["initiated", "success", "failed"] },
  address: { type: String },
  requirments: { type: String },
  data: [
    { name: { type: String }, qty: { type: String }, total: { type: String } },
  ],
  people: { type: String, require: true },
  totalPayment: { type: Number },
  discount: { type: Number },
  paidPayment: { type: Number },
  remainingpayment: { type: Number },
  paymentType: { type: String, enum: ["full", "50%", "30%"] },
  payment_id: { type: String },
  type: { type: String, require: true },
});

module.exports = mongoose.model("inhouse_other", otherSchema);
