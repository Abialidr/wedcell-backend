var express = require("express");
var OppRouter = express.Router();
var OppControllers = require("../controllers/oppControllers");
const auth = require("../../../middleware/auth");
// var UtilsServices = require("../../utils/services/UtilsServices");

OppRouter.post("/other", auth, OppControllers.CreateOtherInhouse);
OppRouter.get("/other/:page", auth, OppControllers.GetOtherInhouse);
OppRouter.get("/other/:search/:page", auth, OppControllers.OtherfullTextSearch);

module.exports = OppRouter;
