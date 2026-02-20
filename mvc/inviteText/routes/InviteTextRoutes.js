var express = require('express');
var InviteTextRouter = express.Router();
var InviteTextControllers = require('../controllers/InviteTextController');
const auth = require('../../../middleware/auth');
// var UtilsServices = require("../../utils/services/UtilsServices");
const uploadMulter = require('../../../middleware/imageUpload');

InviteTextRouter.put(
  '/upload',
  uploadMulter.fields([
    {
      name: 'Img',
      maxCount: 5,
    },
  ]),
  InviteTextControllers.UploadInviteTexts
);
InviteTextRouter.get('/', InviteTextControllers.GetInviteText);
InviteTextRouter.delete('/:id', InviteTextControllers.DeleteInviteText);

module.exports = InviteTextRouter;
