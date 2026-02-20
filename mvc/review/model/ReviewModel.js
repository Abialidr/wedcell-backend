const mongoose = require("mongoose");
const reviewSchema = new mongoose.Schema(
  {
    userid: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "user",
    },
    name: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
      default: "",
    },
    productid: {
      type: String,
      required: true,
    },
    reviewBody: {
      type: String,
      required: true,
    },
    reviewTitle: {
      type: String,
      required: true,
    },
    rating: { type: Number, required: true, default: 0 },
    valueForMoney: { type: Boolean, required: false, default: false },
    fabricQuality: { type: Boolean, required: false, default: false },
    colors: { type: Boolean, required: false, default: false },
    clothStyle: { type: Boolean, required: false, default: false },
    comfort: { type: Boolean, required: false, default: false },
    food: { type: Boolean, required: false, default: false },
    banquet: { type: Boolean, required: false, default: false },
    hospitality: { type: Boolean, required: false, default: false },
    staff: { type: Boolean, required: false, default: false },
    qualitywork: { type: Boolean, required: false, default: false },
    professionalism: { type: Boolean, required: false, default: false },
    onTime: { type: Boolean, required: false, default: false },
    type: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

module.exports = mongoose.model("review", reviewSchema);
