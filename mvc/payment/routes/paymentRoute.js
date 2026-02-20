const express = require("express");
const {
  creatOrder,
  getkeyId,
  verifyOrder,
  webhook,
  createCodOrder,
  creatOrderOg,
  cancelOrder,
} = require("../controllers/paymentController.js");

const router = express.Router();

router.post("/checkout", creatOrder);
router.post("/checkout_cod", createCodOrder);
router.post("/webhook", webhook);
router.post("/verify/payment", verifyOrder);
router.get("/get-key-id", getkeyId);
router.post("/cancel", cancelOrder);
router.post("/checkoutOg", creatOrderOg);

module.exports = router;
