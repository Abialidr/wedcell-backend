var express = require("express");
var HiredVendorRouter = express.Router();
var HiredVendorControllers = require("../controllers/HiredVendorController");
const auth = require("../../../middleware/auth");
// var UtilsServices = require("../../utils/services/UtilsServices");

HiredVendorRouter.post("/", auth, HiredVendorControllers.CreateHiredVendor);
HiredVendorRouter.delete(
  "/:id",
  auth,
  HiredVendorControllers.DeleteHiredVendor
);
HiredVendorRouter.get("/", auth, HiredVendorControllers.GetHiredVendors);
HiredVendorRouter.get("/totalVendor", auth, HiredVendorControllers.TotalGetHiredVendors);
HiredVendorRouter.get("/:id", auth, HiredVendorControllers.GetHiredVendor);
HiredVendorRouter.get(
  "/checkHiredVendor/:id",
  auth,
  HiredVendorControllers.CheckHiredVendor
);

module.exports = HiredVendorRouter;
