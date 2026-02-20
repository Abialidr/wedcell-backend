var express = require('express');
var InhouseRouter = express.Router();
var InhouseControllers = require('../controllers/InhouseControllers');
const auth = require('../../../middleware/auth');
// var UtilsServices = require("../../utils/services/UtilsServices");

InhouseRouter.post('/other', auth, InhouseControllers.CreateOtherInhouse);
InhouseRouter.post('/venue', auth, InhouseControllers.CreateVenueInhouse);
InhouseRouter.get('/other/:page', auth, InhouseControllers.GetOtherInhouse);
InhouseRouter.get('/venue/:page', auth, InhouseControllers.GetVenueInhouse);
InhouseRouter.get(
  '/other/:search/:page',
  auth,
  InhouseControllers.OtherfullTextSearch
);
InhouseRouter.get(
  '/venue/:search/:page',
  auth,
  InhouseControllers.VenuefullTextSearch
);

module.exports = InhouseRouter;
