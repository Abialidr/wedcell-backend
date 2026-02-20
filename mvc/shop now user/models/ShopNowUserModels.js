const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// const data = {
//   "name": 'aaaa',
//   "company_name": 'aaa',
//   "mobile": 8200995014,
//   "email": 'aaaa',
//   "company_address": "aaaaa",
//   "warehouse_address": [
//     {
//       "pincode": '',
//       "city": '',
//       "state": '',
//       "country": '',
//       "address1": '',
//       "address2": '',
//       "landmark": ''
//     },
//   ]
// };
//   coverLink: [],
//   profilelink: '',

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
});
const ShopNowUserSchema = new Schema(
  {
    name: { type: String, required: false, trim: true, default: "" },
    company_name: { type: String, required: false, trim: true, default: "" },
    mobile: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      default: "",
    },
    email: { type: String, required: false, trim: true, default: "" },
    categories: { type: String, required: false, trim: true, default: "" },
    company_address: {
      type: String,
      required: false,
      trim: true,
      default: "",
    },
    warehouse_address: [
      {
        type: addressSchema,
        required: false,
        default: {
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

    password: { type: String, required: false, trim: true, default: "" },
    cover_pic: [{ type: String, required: false, trim: true }],
    profile_pic: { type: String, required: false, trim: true, default: "" },
    is_approved: { type: Boolean, required: false, trim: true, default: true },
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
  },
  { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } }
);
module.exports = mongoose.model("ShopNowUser", ShopNowUserSchema);
