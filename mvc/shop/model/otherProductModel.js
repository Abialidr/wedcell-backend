const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    images: [{ type: String, required: false, trim: true }],
    videos: [{ type: String, required: false, trim: true }],
    mainImages: { type: String, required: false, trim: true },
    name: { type: String, required: false, trim: true, default: "" },
    price: { type: Number, required: false, trim: true, default: "" },
    plans: [],
    city: { type: String, required: false, trim: true, default: "" },
    descrition: { type: String, required: false, trim: true, default: "" },
    category: { type: String, required: false, trim: true, default: "" },
    exclusive: { type: Boolean, required: false, trim: true, default: false },
    vendorId: { type: String, required: false, trim: true, default: "" },
    vendorDetails: {},
    popular: { type: Boolean, required: false, trim: true, default: false },
    is_delete: { type: Boolean, required: false, trim: true, default: false },
    is_approved: { type: Boolean, required: false, trim: true, default: false },
    avgRatingTotalRates: { type: Number, default: 0 },
    avgRating: { type: Number, default: 0 },
    avgRatingTotalStars: { type: Number, default: 0 },
    vidLinks: [],
  },
  { timestamps: true }
);
productSchema.index({
  productName: "text",
  companyName: "text",
  city: "text",
  category: "text",
});
module.exports = mongoose.model("OtherProduct", productSchema);
