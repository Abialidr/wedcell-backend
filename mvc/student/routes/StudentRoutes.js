const express = require("express");
const StudentRouter = express.Router();
const {
  login,
  signup,
  isWorking,
  update,
  getOne,
  getAll,
  verify,
  changePassword,
  getAllByCity,
  getAllForAdmin,
} = require("../controllers/StudentController");
const auth = require("../../../middleware/auth");
const uploadMulter = require("../../../middleware/imageUpload");

StudentRouter.post("/signup", signup);
StudentRouter.post("/login", login);
StudentRouter.post(
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
  update
);
StudentRouter.post("/verify", [auth], verify);
StudentRouter.post("/password", [auth], changePassword);
StudentRouter.get("/getall", getAll);
StudentRouter.get("/getallbycity/:id", getAllByCity);
StudentRouter.get("/getone/:id", getOne);
StudentRouter.get("/getallforadmin", getAllForAdmin);
StudentRouter.get("/", isWorking);

module.exports = StudentRouter;
