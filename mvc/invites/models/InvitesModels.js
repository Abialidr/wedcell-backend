const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const invitesSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    invitesData: {
      type: Array,
      required: true,
    },
    eventID: {
      type: Array,
      required: true,
    },
    events: {
      type: Array,
      required: true,
    },
   
  },
  { timestamps: true }
);
module.exports = mongoose.model('invites', invitesSchema);
