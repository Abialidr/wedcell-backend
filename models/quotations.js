const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const QuotationSchema = new Schema(
  {
    prospectName: { type: String, required: false, trim: true, default: "" },
    prospectId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    prospectContact: {
      type: String,
      required: true,
      trim: true,
      default: "",
    },
    vendorName: { type: String, required: false, trim: true, default: "" },
    vendorId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    allowAccess: [
      {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "users",
      },
    ],
    budget: { type: String, required: false, trim: true, default: "" },
    email: { type: String, required: true, trim: true, default: "" },
    mobile: {
      type: String,
      required: true,
      trim: true,
      default: "",
    },
    eventStartDate: { type: String, required: true, trim: true, default: "" },
    eventEndDate: { type: String, required: true, trim: true, default: "" },
    typeOfevent: { type: String, required: true, trim: true, default: "" },
    numberOfPeople: { type: String, required: true, trim: true, default: "" },
    details: { type: String, required: false, trim: true, default: "" },
  },
  { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

module.exports = mongoose.model("Quotation", QuotationSchema);
