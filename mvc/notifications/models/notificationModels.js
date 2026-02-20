'use strict';
const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const NotificationSchema = new Schema({
  forUserId: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'User' },
  comment: { type: String, required: false, trim: true, default: '' },
  userType: {
    type: String, enum: {
      values: ["admin", "shopkeeper"],
      message:
        "UserType can only be admin, shopkeeper",
    }, trim: true, default: 'admin', trim: ''
  },
  orderId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Order' },
  status: {
    type: String, enum: {
      values: ["Pending", "Completed", "Rejected"],
      message:
        "Status can only be Pending, Completed, Rejected",
    }, trim: true, default: 'Pending', trim: ''
  }
}, { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } });
module.exports = mongoose.model('Notification', NotificationSchema);
