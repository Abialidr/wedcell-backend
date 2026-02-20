var express = require("express");
var VendorUserRoutes = express.Router();
var VendorUserContoller = require("../controllers/VendorUserControllers");
const uploadMulter = require("../../../middleware/imageUpload");
const auth = require("../../../middleware/auth");
const admin = require("../../../middleware/admin");
const album = [];
for (let index = 0; index < 20; index++) {
  album.push({
    name: `album${index}`,
    maxCount: 50,
  });
}
VendorUserRoutes.post(
  "/create",
  [
    uploadMulter.fields([
      ...album,
      {
        name: "main",
        maxCount: 1,
      },
    ]),
  ],
  VendorUserContoller.CreateAccount
);
VendorUserRoutes.put(
  "/update",
  [
    auth,
    uploadMulter.fields([
      ...album,
      {
        name: "main",
        maxCount: 1,
      },
    ]),
  ],
  VendorUserContoller.updateUser
);
VendorUserRoutes.delete("/delete/:id", auth, VendorUserContoller.deleteUser);
VendorUserRoutes.post("/login", VendorUserContoller.UserLogin);
VendorUserRoutes.get("/verifyNumber", auth, VendorUserContoller.verifyNumber);
VendorUserRoutes.get("/verifyEmail", auth, VendorUserContoller.verifyEmail);

VendorUserRoutes.post("/getall", VendorUserContoller.GetItemsAll);
VendorUserRoutes.get("/getall/:id", VendorUserContoller.GetItemsAllVenDors);
VendorUserRoutes.get("/getall", VendorUserContoller.GetItemsAll1);
VendorUserRoutes.get("/fullTextSearch/:id", VendorUserContoller.fullTextSearch);
VendorUserRoutes.get(
  "/dashboarddata/:_id",
  VendorUserContoller.getDashboardData
);

VendorUserRoutes.put(
  "/updatewithpass",
  auth,
  VendorUserContoller.UpdateWithPass
);
VendorUserRoutes.put(
  "/updatepassbyadmin",
  [auth, admin],
  VendorUserContoller.UpdatePassByAdmin
);
VendorUserRoutes.put("/forgotpassword", VendorUserContoller.forgotPassword);
VendorUserRoutes.put("/updateall", VendorUserContoller.updateall);

// VendorUserRoutes.post('/delete', VendorUserContoller.DeleteUser);

module.exports = VendorUserRoutes;
