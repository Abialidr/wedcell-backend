var express = require("express");
var FamilyRouter = express.Router();
var FamilyControllers = require("../controllers/FamilyController");
const auth = require("../../../middleware/auth");
// var UtilsServices = require("../../utils/services/UtilsServices");
const uploadMulter = require("../../../middleware/imageUpload");

FamilyRouter.put("/create", auth, FamilyControllers.CreateFamilys);
FamilyRouter.put("/rsvp/:id", FamilyControllers.RsvpFamilyInfo);
FamilyRouter.get("/", auth, FamilyControllers.GetFamily);
FamilyRouter.get("/getFams", auth, FamilyControllers.GetbyNameFamily);
FamilyRouter.delete("/:id", auth, FamilyControllers.DeleteFamily);
FamilyRouter.post(
  "/sendMessageToAll",
  auth,
  FamilyControllers.sendMessageToAll
);
FamilyRouter.post(
  "/sendMessageOneonOne",
  auth,
  FamilyControllers.sendMessageOneonOne
);

module.exports = FamilyRouter;
