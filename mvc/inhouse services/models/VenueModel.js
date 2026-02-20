const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema({
  name: { type: String, require: true },
  number: { type: String, require: true },
  city: { type: String },
  price: { type: Number, default: 250 },
  doe: { type: String, require: true },
  toe: { type: String },
  budgetHotel: { type: String },
  payment_id: { type: String },
});

module.exports = mongoose.model('inhouse_venue', venueSchema);
