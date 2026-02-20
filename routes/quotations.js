var express = require("express");
var QuotationRouter = express.Router();
var QuotationController = require("../controllers/quotations");
var auth = require("../middleware/auth");

QuotationRouter.post("/add", auth, QuotationController.AddQuotation);
QuotationRouter.get("/get", auth, QuotationController.GetQuotation);
QuotationRouter.post("/delete", auth, QuotationController.DeleteQuotation);

module.exports = QuotationRouter;
