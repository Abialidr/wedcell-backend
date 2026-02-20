const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const SubscriptionSchema = new Schema(
  {
    name: String,
    price: Number,
    services: [String],
    products: String,
    experience: String,
    is_delete: { type: Boolean, required: false, trim: true, default: false },
  },
  { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } }
);
module.exports = mongoose.model("Subscription", SubscriptionSchema);
