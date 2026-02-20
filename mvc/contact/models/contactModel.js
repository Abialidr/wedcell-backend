const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ContactSchema = new Schema(
  {
    prospectName: { type: String, required: false, trim: true, default: '' },
    prospectId: {
      type: Schema.Types.ObjectId,
      required: false,
      // ref: "users",
    },
    prospectContact: {
      type: String,
      required: true,
      trim: true,
      default: '',
    },
    prospectImage: { type: String, required: false, trim: true, default: '' },
    City: { type: String, required: false, trim: true, default: '' },
    State: { type: String, required: false, trim: true, default: '' },
    prospectEmail: { type: String, required: false, trim: true, default: '' },
    Source: { type: String, required: false, trim: true, default: '' },
    LastInteraction: { type: String, required: false, trim: true, default: '' },
    NextInteraction: { type: String, required: false, trim: true, default: '' },
    Handler: { type: String, required: false, trim: true, default: '' },
    Status: { type: String, required: false, trim: true, default: '' },
    Executive: { type: String, required: false, trim: true, default: '' },
    Products: { type: String, required: false, trim: true, default: '' },
    Requirements: { type: String, required: false, trim: true, default: '' },
    Notes: { type: String, required: false, trim: true, default: '' },
    vendorName: { type: String, required: false, trim: true, default: '' },
    vendorId: {
      type: Schema.Types.ObjectId,
      required: true,
      // ref: "users",
    },
    vendorContact: {
      type: String,
      required: true,
      trim: true,
      default: '',
    },
    vendorImage: { type: String, required: false, trim: true, default: '' },
    vendorType: {
      type: String,
      enum: {
        values: ['vendor', 'venue', 'product'],
      },
      trim: true,
      trim: '',
    },
    allowAccess: [
      {
        type: Schema.Types.ObjectId,
        required: true,
        // ref: "users",
      },
    ],
  },
  { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

module.exports = mongoose.model('Contact', ContactSchema);
