const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VendorUserSchema = new Schema(
  {
    name: { type: String, required: false, trim: true, default: "" },
    priority: {
      type: Number,
      required: false,
      trim: true,
      default: 10,
      enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    },
    category: { type: String, required: false, trim: false, default: "" },
    mainImage: { type: String, required: false, trim: false, default: "" },
    description: { type: String, required: false, trim: true, default: "" },
    price: { type: Number, required: false, trim: true, default: "" },
    city: { type: String, required: false, trim: true, default: "" },
    plans: [],
    termsandconditions: {
      type: String,
      required: false,
      trim: true,
      default: "",
    },
    brochure: [{ type: String, required: false, trim: true, default: "" }],
    vendor_id: { type: String, required: false, trim: true, default: "" },
    vendorId: {},
    images: [{ type: String, default: "", trim: "" }],
    vidLinks: [],
    albums: [],
    popular: { type: Boolean, required: false, trim: true, default: false },
    awarded: { type: Boolean, required: false, trim: true, default: false },
    exclusive: { type: Boolean, required: false, trim: true, default: false },
    avgRating: { type: Number, default: 0, trim: "" },
    avgRatingTotalStars: { type: Number, default: 0, trim: "" },
    avgRatingTotalRates: { type: Number, default: 0, trim: "" },
    password: { type: String, required: false, trim: true, default: "" },
    is_approved: { type: Boolean, required: false, trim: true, default: false },
    is_delete: { type: Boolean, required: false, trim: true, default: false },
  },
  { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } }
);
module.exports = mongoose.model("Decor", VendorUserSchema);
