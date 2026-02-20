var express = require("express");
var HandlerUserRouter = express.Router();
var HandlerUserControllers = require("../controllers/HandlerControllers");
const auth = require("../../../middleware/auth");
// var UtilsServices = require("../../utils/services/UtilsServices");

HandlerUserRouter.post("/", auth, HandlerUserControllers.CreateUser);
HandlerUserRouter.patch("/update", HandlerUserControllers.UpdateUser);
HandlerUserRouter.delete("/:id", auth, HandlerUserControllers.DeleteUser);
HandlerUserRouter.get("/get", auth, HandlerUserControllers.GetUsers);

module.exports = HandlerUserRouter;
