const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const InviteTextSchema = new Schema(
  {
    Images: { type: String, required: false, trim: false, default: '' },
    data: { type: String },
    type: { type: String },
    Subtype: { type: String },
  },
  { timestamps: true }
);
module.exports = mongoose.model('InviteText', InviteTextSchema);
