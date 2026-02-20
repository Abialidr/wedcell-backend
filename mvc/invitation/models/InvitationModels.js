const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const invitationSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    groomName: {
      type: String,
      required: true,
      trim: true,
    },
    brideName: {
      type: String,
      required: true,
      trim: true,
    },
    bgColor: {
      type: String,
      required: true,
      trim: true,
    },
    eventFontcolor: {
      type: String,
      required: true,
      trim: true,
    },
    mainFontcolor: {
      type: String,
      required: true,
      trim: true,
    },
    groomSurname: {
      type: String,
      required: true,
      trim: true,
    },
    brideSurname: {
      type: String,
      required: true,
      trim: true,
    },
    weddingDate: {
      type: String,
      required: true,
      trim: true,
    },
    weddingLoc: {
      type: String,
      required: true,
      trim: true,
    },
    ourStory: {
      type: String,
      required: true,
      trim: true,
    },
    groomStory: {
      type: String,
      required: true,
      trim: true,
    },
    brideStory: {
      type: String,
      required: true,
      trim: true,
    },
    eventListDesc: {
      type: String,
      required: true,
      trim: true,
    },
    coverPic: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    eventListBackgrnd: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    storyImg: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    EventList: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        venue: {
          type: String,
          required: true,
          trim: true,
        },
        date: {
          type: String,
          required: true,
          trim: true,
        },
        time: {
          type: String,
          required: true,
          trim: true,
        },
        theme: {
          type: String,
          required: true,
          trim: true,
        },
        colourCode: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],
  },
  { timestamps: true }
);
module.exports = mongoose.model('invitation', invitationSchema);
