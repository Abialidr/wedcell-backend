const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AdminEssentialsSchema = new Schema(
  {
    type: { type: String, required: true, trim: true, unique: true },
    DesktopImage: [],
    venuesDescruption: { type: String, trim: true },
    decoreDescruption: { type: String, trim: true },
    makeupDescruption: { type: String, trim: true },
    mehendiDescruption: { type: String, trim: true },
    photographerDescruption: { type: String, trim: true },
    weddingpannerDescruption: { type: String, trim: true },
    data: [],
    subTypes: { type: Array },
    TextTypes: { type: Array },
  },
  { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

module.exports = mongoose.model('AdminEssentials', AdminEssentialsSchema);
