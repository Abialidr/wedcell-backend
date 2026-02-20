const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const guestSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    group: {
      type: String,
      required: true,
      trim: true,
    },
    menu: {
      type: String,
      required: true,
      trim: true,
    },
    Mobile: {
      type: String,
      required: false,
      trim: true,
    },
    attendence: {
      type: String,
      required: true,
      enum: ['0', '1', '2'],
      default: '1',
      trim: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ['Male', 'Female', 'Male-child', 'Female-child'],
      trim: true,
    },
    Events: {
      type: Array,
    },
    EventsAttendance: {
      type: Array,
    },
    inviteSent: {
      type: Boolean,
      required: false,
      default: false,
      trim: true,
    },
    family: {
      type: String,
      required: false,
      default: false,
      trim: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model('guest', guestSchema);
