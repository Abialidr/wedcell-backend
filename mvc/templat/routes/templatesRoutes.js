var express = require("express");
var TemplateRouter = express.Router();
var TemplateControllers = require("../controllers/templatesControllers");
const auth = require("../../../middleware/auth");
// var UtilsServices = require("../../utils/services/UtilsServices");
const uploadMulter = require("../../../middleware/imageUpload");

TemplateRouter.put(
  "/upload",
  uploadMulter.fields([
    {
      name: "Img",
      maxCount: 5,
    },
  ]),
  TemplateControllers.UploadTemplates
);
TemplateRouter.get("/", TemplateControllers.GetTemplates);
TemplateRouter.get("/:id", TemplateControllers.GetTemplate);
TemplateRouter.delete("/:id", TemplateControllers.DeleteTemplate);
TemplateRouter.put("/updateall", TemplateControllers.updateall);

module.exports = TemplateRouter;
