var express = require('express');
var InvitationRouter = express.Router();
var InvitationControllers = require('../controllers/InvitationControllers');
const auth = require('../../../middleware/auth');
// var UtilsServices = require("../../utils/services/UtilsServices");
const uploadMulter = require('../../../middleware/imageUpload');

InvitationRouter.put(
  '/update',
  [
    auth,
    uploadMulter.fields([
      {
        name: 'coverPic',
        maxCount: 50,
      },
      {
        name: 'eventListBackgrnd',
        maxCount: 1,
      },
      {
        name: 'storyImg',
        maxCount: 1,
      },
    ]),
  ],
  InvitationControllers.UpdateInvites
);
InvitationRouter.get('/', InvitationControllers.GetOneInvites);

module.exports = InvitationRouter;
