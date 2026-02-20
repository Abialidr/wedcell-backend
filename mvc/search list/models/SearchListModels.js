const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SearchListSchema = new Schema(
  {
    name: { type: String, required: false, trim: true, default: "" },
    company_name: { type: String, required: false, trim: true, default: "" },
    userId: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      default: "",
    },
    link: { type: String, required: false, trim: true, default: "" },
  },
  { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } }
);
module.exports = mongoose.model("SearchList", SearchListSchema);
