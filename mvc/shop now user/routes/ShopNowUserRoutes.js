var express = require("express");
var ShopNowUserRoutes = express.Router();
var ShopNowUserContoller = require("../controllers/ShopNowUserControllers");
const uploadMulter = require("../../../middleware/imageUpload");
const auth = require("../../../middleware/auth");
const admin = require("../../../middleware/admin");

ShopNowUserRoutes.post(
  "/create",
  uploadMulter.fields([
    {
      name: "profile_pic",
      maxCount: 1,
    },
    {
      name: "cover_pic",
      maxCount: 5,
    },
  ]),

  ShopNowUserContoller.CreateAccount
);

ShopNowUserRoutes.post("/login", ShopNowUserContoller.UserLogin);
ShopNowUserRoutes.get("/verifyNumber", auth, ShopNowUserContoller.verifyNumber);
ShopNowUserRoutes.get("/verifyEmail", auth, ShopNowUserContoller.verifyEmail);
ShopNowUserRoutes.get("/getall/:id", ShopNowUserContoller.GetUser);
ShopNowUserRoutes.get("/getuserbyid/:id", ShopNowUserContoller.GetUserById);
ShopNowUserRoutes.put(
  "/updatewithpass",
  auth,
  ShopNowUserContoller.UpdateWithPass
);
ShopNowUserRoutes.put(
  "/updatepassbyadmin",
  [auth, admin],
  ShopNowUserContoller.UpdatePassByAdmin
);
ShopNowUserRoutes.put("/forgotpassword", ShopNowUserContoller.forgotPassword);
ShopNowUserRoutes.put(
  "/update",
  [
    auth,
    uploadMulter.fields([
      {
        name: "profile",
        maxCount: 1,
      },
      {
        name: "cover",
        maxCount: 5,
      },
    ]),
  ],
  ShopNowUserContoller.updateUser
);
ShopNowUserRoutes.get(
  "/fullTextSearch/:id",
  ShopNowUserContoller.fullTextSearch
);
ShopNowUserRoutes.delete("/delete/:id", auth, ShopNowUserContoller.deleteUser);
ShopNowUserRoutes.put("/updateall", ShopNowUserContoller.updateall);

// ShopNowUserRoutes.post('/delete', ShopNowUserContoller.DeleteUser);

module.exports = ShopNowUserRoutes;
