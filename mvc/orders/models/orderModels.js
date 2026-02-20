"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const OrderSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Item",
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Item",
    },
    shopkeeperId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    amount: { type: Number, required: false, trim: true, default: 0 },
    shipping: { type: Number, required: false, trim: true, default: 0 },
    tax: { type: Number, required: false, trim: true, default: 0 },
    size: { type: String, required: false, trim: true },
    weight: { type: String, required: false, trim: true, default: 0 },
    quantity: { type: Number, required: true, trim: true, default: 0 },
    shippingAddress: { type: Object, required: true,  default: {} },
    zipcode: { type: String, required: false, trim: true, default: "" },
    specialInstructions: {
      type: String,
      required: false,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: {
        values: ["Pending", "Completed", "Rejected", "Refunded", "Returned"],
        message: "Status can only be Pending, Completed, Rejected, Refunded, Returned",
      },
      trim: true,
      default: "Pending",
      trim: "",
    },
    orderStatus: {
      type: String,
      enum: {
        values: ["Processing", "Completed", "Cancelled", "Refunded", "Returned"],
        message: "Order Status can only be Pending, Completed, Rejected",
      },
      trim: true,
      default: "Initiated",
      trim: "",
    },
    paymentMode: {
      type: String,
      enum: {
        values: ["COD", "Prepaid"],
        message: "Payment Mode can only be COD, Prepaid",
      },
      trim: true,
      // default: "Initiated",
      trim: "",
    },

    paymentInfo: { type: String, required: true, trim: true, default: "" },
    paymentId: { type: String, trim: true},
    waybill: { type: String, trim: true},
  },
  { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } }
);
module.exports = mongoose.model("Order", OrderSchema);
