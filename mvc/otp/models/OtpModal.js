const { truncateSync } = require("fs");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;



const OtpSchema = new Schema(
  {
    mobile: {
      type: String,
      required: false,
      trim: true,
      unique: true,
    },
    email: { type: String, required: false ,unique: truncateSync},
    otp: { type: String, required: true, },
    updatedAt: {
      type: Date,
      default: Date.now,
      expires: 300
    },
  },
  { timestamps: { createdAt: true, updatedAt: true }, toObject: { virtuals: true }, toJSON: { virtuals: true } }
);
module.exports = mongoose.model("Otp", OtpSchema);
