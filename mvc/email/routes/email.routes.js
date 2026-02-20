var express = require('express');
var EmailRouter = express.Router();
var EmailControllers = require('../controllers/email.controllers');

/**
 * Email routes
 */
EmailRouter.post('/forgot/password', EmailControllers.ForgotPassword);
EmailRouter.post('/reset/password', EmailControllers.ResetPassword);
module.exports = EmailRouter;
