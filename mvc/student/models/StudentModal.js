const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const personalDetailSchema = mongoose.Schema({
  height: { type: String, required: false, trim: true, default: "" },
  eventsAttended: { type: String, required: false, trim: true, default: "" },
  skincolour: { type: String, required: false, trim: true, default: "" },
  internshipStatus: {
    type: Boolean,
    required: false,
    trim: true,
    default: false,
  },
  diplomaStatus: { type: Boolean, required: false, trim: true, default: false },
  currentlyEmployed: {
    type: Boolean,
    required: false,
    trim: true,
    default: false,
  },
  language: { type: String, required: false, trim: true, default: "" },
});
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

const StudentSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, default: "" },
    mobile: {
      type: Number,
      required: true,
      trim: true,
      unique: true,
    },
    email: { type: String, required: false, default: "" },
    password: { type: String, required: true },
    cover_pic: [{ type: String, required: false, trim: true }],
    profile_pic: { type: String, required: false, trim: true ,default:""},
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
      required: true,
      trim: true,
      default: false,
    },
    notificationList: [],
    personaldetails: {
      type: personalDetailSchema,
      required: false,
      default: {
        height: "",
        eventsAttended: "",
        skincolour: "",
        internshipStatus: false,
        diplomaStatus: false,
        currentlyEmployed: false,
        language: "",
      },
    },
    addressDetails: {
      type: addressSchema,
      require: false,
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
  },
  { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } }
);
module.exports = mongoose.model("Student", StudentSchema);
