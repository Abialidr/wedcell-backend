var express = require("express");
var adminEssentialsRouter = express.Router();
var adminEssentialsControllers = require("../controllers/AdminEssentialsController");
var UtilsServices = require("../../utils/services/UtilsServices");
var auth = require("../../../middleware/auth");
const uploadMulter = require("../../../middleware/imageUpload");
const desktop = [];
const laptop = [];
const tablet = [];
const mobile = [],
  galery = [],
  album = [];
for (let index = 0; index < 100; index++) {
  album.push({
    name: `album${index}`,
    maxCount: 50,
  });
}

for (let index = 0; index < 100; index++) {
  galery.push({
    name: `galery${index}`,
    maxCount: 50,
  });
}
for (let i = 0; i < 10; i++) {
  desktop.push({
    name: `desktop${i}`,
    maxCount: 1,
  });
  laptop.push({
    name: `laptop${i}`,
    maxCount: 1,
  });
  tablet.push({
    name: `tablet${i}`,
    maxCount: 1,
  });
  mobile.push({
    name: `mobile${i}`,
    maxCount: 1,
  });
}
adminEssentialsRouter.post("/", [auth], adminEssentialsControllers.CreateItems);
adminEssentialsRouter.get("/", adminEssentialsControllers.Get_Items);
adminEssentialsRouter.put(
  "/",
  [auth, uploadMulter.fields([...desktop, ...laptop, ...mobile, ...tablet])],
  adminEssentialsControllers.UpdateItems
);

adminEssentialsRouter.put(
  "/inHouses",
  [auth],
  adminEssentialsControllers.UpdateInHouse
);
adminEssentialsRouter.put(
  "/inHouses/new",
  [auth, uploadMulter.fields([...galery, ...album])],

  adminEssentialsControllers.UpdateInHouseAll
);

adminEssentialsRouter.put(
  "/component",
  adminEssentialsControllers.Update_Componets
);
adminEssentialsRouter.put(
  "/inHouses/updateImage",
  [
    auth,
    uploadMulter.fields([
      {
        name: `image1`,
        maxCount: 50,
      },
      {
        name: `image2`,
        maxCount: 50,
      },
      {
        name: `image3`,
        maxCount: 50,
      },
    ]),
  ],
  adminEssentialsControllers.UpdateImages
);
adminEssentialsRouter.get("/mehendi", adminEssentialsControllers.Get_Mehendi);
adminEssentialsRouter.get("/makeup", adminEssentialsControllers.Get_Makeup);
adminEssentialsRouter.get(
  "/photography",
  adminEssentialsControllers.Get_Photography
);
adminEssentialsRouter.get("/wedding", adminEssentialsControllers.Get_Wedding);
adminEssentialsRouter.get("/dhol", adminEssentialsControllers.Get_Dhol);
adminEssentialsRouter.get("/decore", adminEssentialsControllers.Get_Decore);
adminEssentialsRouter.get(
  "/component",
  adminEssentialsControllers.Get_Componets
);
adminEssentialsRouter.put("/updateall", adminEssentialsControllers.updateall);

module.exports = adminEssentialsRouter;
