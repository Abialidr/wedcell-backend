var express = require('express');
var InvitesImgRouter = express.Router();
var InvitesImgControllers = require('../controllers/InvitesImgControllers');
const auth = require('../../../middleware/auth');
// var UtilsServices = require("../../utils/services/UtilsServices");
const uploadMulter = require('../../../middleware/imageUpload');

InvitesImgRouter.put(
  '/upload',
  auth,
  uploadMulter.fields([
    {
      name: 'Img',
      maxCount: 1,
    },
  ]),
  InvitesImgControllers.UploadInviteImage
);
InvitesImgRouter.get('/', auth, InvitesImgControllers.GetInvitesImg);
InvitesImgRouter.delete('/:id', InvitesImgControllers.DeleteImg);
InvitesImgRouter.get('/getAdmin', InvitesImgControllers.GetforAdmin);
InvitesImgRouter.put('/uploadAdmin', InvitesImgControllers.UploadforAdmin);
// InvitesImgRouter.get('/getById/:id', InvitesControllers.GetInvitesbyId);

module.exports = InvitesImgRouter;
