const mongoose = require("mongoose");
const replySchema = new mongoose.Schema(
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
    reviewid: {
      type: String,
      required: true,
    },
    replyBody: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

module.exports = mongoose.model("reply", replySchema);
