const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: { type: String, required: false, trim: true, default: '' },
  is_delete: { type: Boolean, required: false, trim: true, default: false },
}, { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } });
module.exports = mongoose.model('Category', CategorySchema);
