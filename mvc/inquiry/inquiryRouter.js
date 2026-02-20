const express = require("express");
const {
  registerInquiry,
  deleteInquiry,
  allInquiry,
} = require("./inquiryController");
const protectAdmin = require("../../middleware/admin");

const router = express.Router();

router
  .route("/")
  .post(registerInquiry)
  .get(allInquiry)
  .delete(protectAdmin, deleteInquiry);

module.exports = router;
