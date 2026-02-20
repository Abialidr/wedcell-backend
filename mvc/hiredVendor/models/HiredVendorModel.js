const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const HiredVendorSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    product: {
      productId: { type: String, required: false },
      name: { type: String, required: false },
      price: { type: String, required: false },
      type: { type: String, required: false },
      bannerImage: { type: String, required: false },
      category: { type: String, required: false },
      subCategory: { type: String, required: false },
    },
    active: { type: Boolean, required: false, default: true },
    modifiedOn: { type: Date, required: false, default: Date.now },
    is_delete: { type: Boolean, required: false, trim: true, default: false },
  },
  { timestamps: true }
);
module.exports = mongoose.model("HiredVendor", HiredVendorSchema);
