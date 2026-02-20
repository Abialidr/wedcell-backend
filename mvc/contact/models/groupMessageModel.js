'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const GroupMessageSchema = new Schema(
  {
    initiatorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    groupName: { type: String, required: true },
    prospectName: { type: String, required: false, trim: true, default: '' },
    prospectId: {
      type: Schema.Types.ObjectId,
      required: true,
      // ref: "users",
    },
    prospectContact: {
      type: String,
      required: true,
      trim: true,
      default: '',
    },
    prospectImage: { type: String, required: false, trim: true, default: '' },
    currentUsers: [{ type: mongoose.Schema.Types.ObjectId }],

    previousUsers: [
      {
        id: {
          type: Schema.Types.ObjectId,
          required: true,
          // ref: "users",
        },

        leaveTime: { type: Date },
      },
    ],
    vendorInfo: [
      {
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
      },
    ],
    allowAccess: [
      {
        type: Schema.Types.ObjectId,
        required: true,
        // ref: "users",
      },
    ],

    messages: [
      {
        senderId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        senderName: {
          type: String,
          required: true,
        },
        receiverId: [
          {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
          },
        ],
        message: {
          type: String,
          required: true,
        },
        messageType: {
          type: String,
          enum: {
            values: ['text', 'doc', 'image', 'video', 'joined', 'left'],
          },
          trim: true,
          default: 'text',
          trim: '',
        },
        replyOf: {
          msgId: {
            type: mongoose.Schema.Types.ObjectId,
          },
          sender: String,
          msg: String,
          msgType: String,
        },
        forwarded: { type: Boolean, default: false },
        readBy: [{ type: mongoose.Schema.Types.ObjectId }],
        deletedBy: [{ type: mongoose.Schema.Types.ObjectId }],
        timestamp: { type: Date, default: Date.now },
      },
    ],
    updatedAt: { type: Date },
  },
  { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

module.exports = mongoose.model('GroupMessage', GroupMessageSchema);
