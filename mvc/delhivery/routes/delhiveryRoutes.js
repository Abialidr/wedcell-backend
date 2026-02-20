const express = require('express');
const {
check, checkCharge,packingSlip
} = require('../controller/delhiveryController');

const router = express.Router();

router.get('/check', check);
router.get('/check_charges', checkCharge);
router.get('/packing_slip', packingSlip);

module.exports = router;
