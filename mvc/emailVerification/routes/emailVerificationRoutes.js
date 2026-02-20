const express = require("express");
var {verify , addEmail} = require("../controller/emailVerification");

const router = express();

router.post('/addEmail', addEmail);
router.post('/verify', verify);

module.exports = router;