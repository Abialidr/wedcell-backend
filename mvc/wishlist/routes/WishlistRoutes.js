var express = require("express");
var WishlistRouter = express.Router();
var WishlistControllers = require("../controllers/WishlistControllers");
const auth = require("../../../middleware/auth");
// var UtilsServices = require("../../utils/services/UtilsServices");

WishlistRouter.post("/", auth, WishlistControllers.CreateWishlists);
WishlistRouter.delete("/:id", auth, WishlistControllers.DeleteWishlist);
WishlistRouter.get("/", auth, WishlistControllers.GetWishlists);
WishlistRouter.get("/:id", auth, WishlistControllers.GetWishlist);
WishlistRouter.get(
  "/checkWishlist/:id",
  auth,
  WishlistControllers.CheckWishlist
);

module.exports = WishlistRouter;
