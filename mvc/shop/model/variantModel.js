const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema(
  {
    images: [{ type: String, required: false, trim: true }],
    videos: [{ type: String, required: false, trim: true }],
    mainImages: { type: String, required: false, trim: true },
    fabric: { type: String, required: false, trim: true, default: '' },
    sleeveLength: { type: String, required: false, trim: true, default: '' },
    name: { type: String, required: false, trim: true, default: '' },
    psizes: {
      Small: {
        qauntity: { type: Number, required: false, default: 0 },
        priceInclusive: { type: Number, required: false, default: 0 },
        priceExclusive: { type: Number, required: false, default: 0 },
        discount: { type: Number, required: false, default: 0 },
        weight: { type: Number, required: false, default: 0 },
      },
      Medium: {
        qauntity: { type: Number, required: false, default: 0 },
        priceInclusive: { type: Number, required: false, default: 0 },
        priceExclusive: { type: Number, required: false, default: 0 },
        discount: { type: Number, required: false, default: 0 },
        weight: { type: Number, required: false, default: 0 },
      },
      Large: {
        qauntity: { type: Number, required: false, default: 0 },
        priceInclusive: { type: Number, required: false, default: 0 },
        priceExclusive: { type: Number, required: false, default: 0 },
        discount: { type: Number, required: false, default: 0 },
        weight: { type: Number, required: false, default: 0 },
      },
      'Extra Large': {
        qauntity: { type: Number, required: false, default: 0 },
        priceInclusive: { type: Number, required: false, default: 0 },
        priceExclusive: { type: Number, required: false, default: 0 },
        discount: { type: Number, required: false, default: 0 },
        weight: { type: Number, required: false, default: 0 },
      },
      XXL: {
        qauntity: { type: Number, required: false, default: 0 },
        priceInclusive: { type: Number, required: false, default: 0 },
        priceExclusive: { type: Number, required: false, default: 0 },
        discount: { type: Number, required: false, default: 0 },
        weight: { type: Number, required: false, default: 0 },
      },
      XXXL: {
        qauntity: { type: Number, required: false, default: 0 },
        priceInclusive: { type: Number, required: false, default: 0 },
        priceExclusive: { type: Number, required: false, default: 0 },
        discount: { type: Number, required: false, default: 0 },
        weight: { type: Number, required: false, default: 0 },
      },
    },
    category: { type: String, required: false, trim: true, default: '' },
    color: { type: String, required: false, trim: true, default: '' },
    occation: { type: String, required: false, trim: true, default: '' },
    subCategory: { type: String, required: false, trim: true, default: '' },
    city: { type: String, required: false, trim: true, default: '' },
    popular: { type: Boolean, required: false, trim: true, default: false },
    exclusive: { type: Boolean, required: false, trim: true, default: false },
    avgRating: { type: Number, default: 0 },
    vidLinks: [],
    productName: { type: String, required: false, trim: true },
    productId: { type: String, required: false, trim: true },
    vendorId: { type: String, required: false, trim: true },
    manufacturingDetails: {
      type: String,
      required: false,
      trim: true,
      default: '',
    },
    avgRatingTotalRates: { type: Number, default: 0 },
    is_delete: { type: Boolean, required: false, trim: true, default: false },
    is_approved: { type: Boolean, required: false, trim: true, default: false },
  },
  { timestamps: true }
);

variantSchema.index({
  name: 'text',
  productName: 'text',
  city: 'text',
  category: 'text',
});

module.exports = mongoose.model('Variant', variantSchema);
