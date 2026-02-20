const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const invitesImagesSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    Images: { type: String, required: false, trim: false, default: '' },
    dataurl: { type: String, required: false, trim: false, default: '' },
    type1: { type: String, required: false },
    type2: { type: String, required: false },
    Subtype: { type: String, required: false },
    isAdmin: { type: Boolean, required: false },
  },
  { timestamps: true }
);
module.exports = mongoose.model('invitesImages', invitesImagesSchema);
