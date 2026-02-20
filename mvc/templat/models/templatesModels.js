const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const templateSchema = new Schema(
  {
    Images: { type: String, required: false, trim: false, default: '' },
    data: { type: Array },
  },
  { timestamps: true }
);
module.exports = mongoose.model('Templates', templateSchema);
