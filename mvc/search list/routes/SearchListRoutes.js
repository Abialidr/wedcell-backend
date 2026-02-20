var express = require("express");
var SearchListRoutes = express.Router();
var SearchListContoller = require("../controllers/SearchListController");
const uploadMulter = require("../../../middleware/imageUpload");
const auth = require("../../../middleware/auth");
const admin = require("../../../middleware/admin");
const album = [];

SearchListRoutes.get("/fullTextSearch/:id", SearchListContoller.fullTextSearch);

module.exports = SearchListRoutes;
