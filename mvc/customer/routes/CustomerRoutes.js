var express = require("express");
var CustomerRoutes = express.Router();
const uploadMulter = require("../../../middleware/imageUpload");
const auth = require("../../../middleware/auth");
const admin = require("../../../middleware/admin");
const CustomerContoller = require("../controllers/CustomerControllers");

CustomerRoutes.post(
  "/create",
  uploadMulter.fields([
    {
      name: "brideImage",
      maxCount: 1,
    },
    {
      name: "groomImage",
      maxCount: 1,
    },
  ]),

  CustomerContoller.CreateAccount
);
CustomerRoutes.put(
  "/weddingpersonal",
  [
    auth,
    uploadMulter.fields([
      {
        name: "brideImage",
        maxCount: 1,
      },
      {
        name: "groomImage",
        maxCount: 1,
      },
    ]),
  ],
  CustomerContoller.UpdateWeddingPersonal
);
CustomerRoutes.post("/login", CustomerContoller.UserLogin);
CustomerRoutes.get("/verifyNumber", auth, CustomerContoller.verifyNumber);
CustomerRoutes.get("/verifyEmail", auth, CustomerContoller.verifyEmail);
CustomerRoutes.get("/getall/:id", CustomerContoller.GetUser);
CustomerRoutes.get("/getuserbyid/:id", CustomerContoller.GetUserById);
CustomerRoutes.put("/updatewithpass", auth, CustomerContoller.UpdateWithPass);
CustomerRoutes.post("/generatepdf", auth, CustomerContoller.createPdf);
CustomerRoutes.put(
  "/updatepassbyadmin",
  [auth, admin],
  CustomerContoller.UpdatePassByAdmin
);
CustomerRoutes.put("/forgotpassword", CustomerContoller.forgotPassword);
CustomerRoutes.put(
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
  CustomerContoller.updateUser
);
CustomerRoutes.put(
  "/updatecoverpic",
  [
    auth,
    uploadMulter.fields([
      {
        name: "cover",
        maxCount: 5,
      },
    ]),
  ],
  CustomerContoller.UpdateCoverPic
);
CustomerRoutes.put("/updatetgm", auth, CustomerContoller.updateTGM);

CustomerRoutes.put("/deletetgm", auth, CustomerContoller.deleteTGM);
CustomerRoutes.get("/fullTextSearch/:id", CustomerContoller.fullTextSearch);
CustomerRoutes.delete("/delete", auth, CustomerContoller.DeleteOneUser);
// CustomerRoutes.put('/updateall', CustomerModels.updateall);
module.exports = CustomerRoutes;
