const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const RealGroupMessageSchema = new Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    senderName: {
      type: String,
      required: true,
    },
    receiverId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
    ],
    message: {
      type: String,
      required: true,
    },
    messageType: {
      type: String,
      enum: {
        values: ["text", "doc", "image", "video", "joined", "left"],
      },
      trim: true,
      default: "text",
      trim: "",
    },
    replyOf: {
      msgId: {
        type: mongoose.Schema.Types.ObjectId,
      },
      sender: String,
      msg: String,
      msgType: String,
    },
    forwarded: { type: Boolean, default: false },
    readBy: [{ type: mongoose.Schema.Types.ObjectId }],
    deletedBy: [{ type: mongoose.Schema.Types.ObjectId }],
    timestamp: { type: Date, default: Date.now },
    message_parent_id: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } }
);
module.exports = mongoose.model("RealGroupMessage", RealGroupMessageSchema);
