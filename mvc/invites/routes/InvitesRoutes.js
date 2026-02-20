var express = require('express');
var InvitesRouter = express.Router();
var InvitesControllers = require('../controllers/InvitesControllers');
const auth = require('../../../middleware/auth');
// var UtilsServices = require("../../utils/services/UtilsServices");
const uploadMulter = require('../../../middleware/imageUpload');

InvitesRouter.put('/update', auth, InvitesControllers.UpdateInvites);
InvitesRouter.put('/updateAdmin', InvitesControllers.UpdateInvitesforAdmin);
InvitesRouter.get('/', auth, InvitesControllers.GetOneInvites);
InvitesRouter.get('/getById/:id', InvitesControllers.GetInvitesbyId);
InvitesRouter.get(
  '/getByFamilyId/:id',
  InvitesControllers.GetInvitesFamilybyId
);
InvitesRouter.post('/getAdmin', InvitesControllers.GetOneInvitesforAdmin);
InvitesRouter.get('/getSize/:id', InvitesControllers.GetInvitesbyIdAndFindSize);
// InvitesRouter.get(
//   '/getByIdAdmin/:id',
//   InvitesControllers.GetInvitesbyIdforAdmin
// );

module.exports = InvitesRouter;
