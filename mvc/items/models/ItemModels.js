const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ItemSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    mainImage: { type: String, required: false, trim: false, default: '' },
    type: { type: String, required: true, trim: true, default: '' },
    city: { type: String, required: false, trim: true, default: '' },
    category: { type: String, required: false, trim: true, default: '' },
    subCategory: { type: String, required: false, trim: true, default: '' },
    description: { type: String, required: false, trim: true, default: '' },
    contactPhone: { type: String, required: false, trim: true, default: '' },
    contactEmail: { type: String, required: false, trim: true, default: '' },
    address: { type: String, required: false, trim: true, default: '' },
    price: { type: Number, required: false, trim: true, default: '' },
    amenities: [],
    menu: [{ type: String, required: false, trim: true, default: '' }],
    vegPerPlate: { type: String, required: false, trim: true, default: '' },
    nonVegPerPlate: { type: String, required: false, trim: true, default: '' },
    allowedVendors: [],
    features: [],
    secondNumbers: [{ type: String, required: false, trim: true, default: '' }],
    plans: [],
    termsandconditions: {
      type: String,
      required: false,
      trim: true,
      default: '',
    },
    brochure: [{ type: String, required: false, trim: true, default: '' }],
    images: [{ type: String, default: '', trim: '' }],
    vidLinks: [],
    albums: [],
    wishlist: [],
    terms: [],
    popular: { type: Boolean, required: false, trim: true, default: false },
    fourStar: { type: Boolean, required: false, trim: true, default: false },
    fiveStar: { type: Boolean, required: false, trim: true, default: false },
    awarded: { type: Boolean, required: false, trim: true, default: false },
    exclusive: { type: Boolean, required: false, trim: true, default: false },



    
    state: { type: String, required: false, trim: true, default: '' },
    country: { type: String, required: false, trim: true, default: '' },
    localisation: [{ type: String, required: false }],
    vendorId: {
      type: String,
      required: false,
      ref: 'User',
    },
    zipcode: { type: String, required: false, trim: true, default: '' },
    avgRating: { type: Number, default: 0, trim: '' },
    avgRatingTotalStars: { type: Number, default: 0, trim: '' },
    avgRatingTotalRates: { type: Number, default: 0, trim: '' },
    is_delete: { type: Boolean, required: false, trim: true, default: false },
    is_approved: { type: Boolean, required: false, trim: true, default: true },
  },
  { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

ItemSchema.index({ name: 'text' });

module.exports = mongoose.model('Item', ItemSchema);
