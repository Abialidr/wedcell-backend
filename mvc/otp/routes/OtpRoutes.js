const express = require('express');
const OtpRouter = express.Router();
const Otp = require('../controllers/OtpController');
OtpRouter.post('/', Otp.SendOtp);
OtpRouter.get('/', Otp.isWorking);
OtpRouter.post('/verify', Otp.VerifyOtp);

module.exports = OtpRouter;
