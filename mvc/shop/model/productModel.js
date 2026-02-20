const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    category: { type: String, required: false, trim: true, default: '' },
    subCategory: { type: String, required: false, trim: true, default: '' },
    occation: { type: String, required: false, trim: true, default: '' },
    garmentType: { type: String, required: false, trim: true, default: '' },
    manufacturingDetails: {
      type: String,
      required: false,
      trim: true,
      default: '',
    },
    avgRatingTotalRates: { type: Number, default: 0 },
    avgRating: { type: Number, default: 0 },
    avgRatingTotalStars: { type: Number, default: 0 },
    descrition: { type: String, required: false, trim: true, default: '' },
    is_delete: { type: Boolean, required: false, trim: true, default: false },
    is_approved: { type: Boolean, required: false, trim: true, default: false },
    popular: { type: Boolean, required: false, trim: true, default: false },
    exclusive: { type: Boolean, required: false, trim: true, default: false },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: 'ShopNowUser',
    },
    productName: { type: String, required: false, trim: true, default: '' },
    variants: [{ type: String, required: false, trim: true }],
  },
  { timestamps: true }
);

productSchema.index({
  productName: 'text',
  companyName: 'text',
  city: 'text',
  category: 'text',
});

module.exports = mongoose.model('Product', productSchema);
