const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EventSchema = new Schema(
  {
    start_date: { type: String, required: true },
    end_date: { type: String, required: true },
    start_time: { type: String, required: true, trim: true, default: "" },
    end_time: { type: String, required: true, trim: true, default: "" },
    venue: { type: String, required: true, trim: true, default: "" },
    event_type: { type: String, required: true, trim: true, default: "" },
    required_member: { type: String, required: true, trim: true, default: "" },
    required_member_type: { type: String, required: true, trim: true, default: "" },
    sallery: {
      type: String,
      required: false,
      trim: true,
      default: "",
    },
    vendor_id: { type: String, required: true, trim: true, default: "" },
  },
  { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } }
);
module.exports = mongoose.model("Event", EventSchema);
