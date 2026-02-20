const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const addressSchema = mongoose.Schema({
  pincode: {
    type: String,
    required: false,
    trim: true,
    default: "",
    min: 6,
    max: 6,
  },
  city: { type: String, required: false, trim: true, default: "" },
  state: { type: String, required: false, trim: true, default: "" },
  country: { type: String, required: false, trim: true, default: "" },
  address1: { type: String, required: false, trim: true, default: "" },
  address2: { type: String, required: false, trim: true, default: "" },
  landmark: { type: String, required: false, trim: true, default: "" },
  name: { type: String, required: false, trim: true, default: "" },
  email: { type: String, required: false, trim: true, default: "" },
  number: { type: String, required: false, trim: true, default: "" },
});
const weddingSchema = mongoose.Schema({
  groomName: {
    type: String,
    required: false,
    trim: true,
    default: "",
  },
  brideName: {
    type: String,
    required: false,
    trim: true,
    default: "",
  },
  groomImage: {
    type: String,
    required: false,
    trim: true,
    default: "",
  },
  brideImage: {
    type: String,
    required: false,
    trim: true,
    default: "",
  },
  eventDate: { type: String, required: false, trim: true, default: "" },
  startTime: { type: String, required: false, trim: true, default: "" },
  endTime: { type: String, required: false, trim: true, default: "" },
});
const CustomerSchema = new Schema(
  {
    name: { type: String, required: false, trim: true, default: "" },
    mobile: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      default: "",
    },
    email: {
      type: String,
      required: false,
      trim: true,
      // unique: true,
    },

    shipping_address: [
      {
        type: addressSchema,
        required: false,
        default: {
          name: "",
          email: "",
          number: "",
          pincode: "",
          city: "",
          state: "",
          country: "",
          address1: "",
          address2: "",
          landmark: "",
        },
      },
    ],
    weddingPersonal: {
      type: weddingSchema,
      required: false,
      default: {
        groomName: "",
        brideName: "",
        groomImage: "",
        brideImage: "",
        eventDate: "",
        startTime: "",
        endTime: "",
      },
    },
    is_both_address_same: {
      type: Boolean,
      required: false,
      trim: true,
      default: false,
    },
    password: { type: String, required: false, trim: true, default: "" },
    cover_pic: [{ type: String, required: false, trim: true }],
    profile_pic: { type: String, required: false, trim: true, default: "" },
    is_approved: { type: Boolean, required: false, trim: true, default: false },
    is_delete: { type: Boolean, required: false, trim: true, default: false },
    is_email_verified: {
      type: Boolean,
      required: false,
      trim: true,
      default: false,
    },
    is_mobile_verified: {
      type: Boolean,
      required: false,
      trim: true,
      default: false,
    },
    todos: [{ type: String, required: false, trim: true }],
    guest: [{ type: String, required: false, trim: true }],
    menu: [{ type: String, required: false, trim: true }],
    family: { type: Array, required: false, trim: true },
    notificationList: [],
  },
  { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } }
);
module.exports = mongoose.model("customer", CustomerSchema);
