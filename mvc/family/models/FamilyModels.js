const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const FamilySchema = new Schema(
  {
    userID: { type: String, required: false, trim: false, default: "" },
    FamilyName: { type: String, required: false, trim: false },
    FamilyContact: { type: String },
    Attending: { type: Boolean },
    Events: { type: Array },
    Guest: { type: Array },
    InviteSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Family", FamilySchema);
