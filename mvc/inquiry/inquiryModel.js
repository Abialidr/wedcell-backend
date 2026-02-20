const mongoose = require("mongoose");
const InquirySchema = new mongoose.Schema(
  {
    pName: { type: String, required: true },
    email: { type: String, required: true },
    city: { type: String },
    mNo: { type: String },
    description: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("inquiry", InquirySchema);
