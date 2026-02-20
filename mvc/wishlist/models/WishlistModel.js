const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const WishlistSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    product: {
      productId: { type: String, required: false },
      name: { type: String, required: false },
      city: { type: String, required: false },
      mobile: { type: String, required: false },
      price: { type: String, required: false },
      type: { type: String, required: false },
      bannerImage: { type: String, required: false },
      exclusive: { type: Boolean, required: false },
      category: { type: String, required: false },
      subCategory: { type: String, required: false },
      link: { type: String, required: false },
    },
    active: { type: Boolean, required: false, default: true },
    modifiedOn: { type: Date, required: false, default: Date.now },
    is_delete: { type: Boolean, required: false, trim: true, default: false },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Wishlist", WishlistSchema);
