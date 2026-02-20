const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CartSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    variantId: { type: String, required: false },
    quantity: { type: Number, required: false },
    name: { type: String, required: false },
    price: { type: String, required: false },
    totalPrice: { type: String, required: false },
    bannerImage: { type: String, required: false },
    size: { type: String, required: false },
  },
  { timestamps: true }
);
module.exports = mongoose.model('Cart', CartSchema);
