const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const handlerUserSchema = new Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      // ref: "",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    contact: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("handlerUser", handlerUserSchema);
