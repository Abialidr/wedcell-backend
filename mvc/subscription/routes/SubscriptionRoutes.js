var express = require("express");
var router = express.Router();
var controller = require("../controllers/subscriptionControllers");
var UtilsServices = require("../../utils/services/UtilsServices");
var auth = require("../../../middleware/auth");

/**
 * Users routes
 */
router.post("/", controller.CreateSubscription);
router.get("/", controller.GetSubscriptionAll);
router.get("/:id", controller.GetSubscription);
router.put("/", controller.UpdateSubscription);
router.delete("/", controller.DeleteSubscription);

module.exports = router;
