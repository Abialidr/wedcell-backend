var express = require('express');
var UsersRouter = express.Router();
var UserController = require('../controllers/UserControllers');
var UtilsServices = require('../../utils/services/UtilsServices');
const uploadMulter = require('../../../middleware/imageUpload');
const auth = require('../../../middleware/auth');

// UsersRouter.post('/session', UserController.IsSession);

// UsersRouter.put(
//   '/uploadprofile',
//   UtilsServices.ProfileUpload.array('profile_pic'),
//   UserController.ProfileImageUpload
// );

// UsersRouter.post('/createpaymentintent', UserController.createPaymetIntent);
// UsersRouter.post('/create/account', UserController.CreateAccount);
UsersRouter.post('/login', UserController.UserLogin);
UsersRouter.post('/adminlogin', UserController.AdminLogin);
UsersRouter.patch('/reset/password', UserController.Reset_Password);
UsersRouter.post('/resetpasswordotp', UserController.ResetPasswordOTP);
UsersRouter.post('/resetwithphone', UserController.ResetPasswordPhone);
UsersRouter.patch('/resetuniquemobile', UserController.Reset_UniqueMobile);
UsersRouter.post('/verifyotp', UserController.VerifyOTP);
UsersRouter.post('/shopkeeper', UserController.GetShopkeeper);
UsersRouter.post('/changestatus', UserController.ChangeUserStatus);
UsersRouter.post('/get', UserController.GetUser);
UsersRouter.post('/getuserbyid', UserController.GetUserById);
UsersRouter.patch(
  '/update',
  [
    auth,
    uploadMulter.fields([
      {
        name: 'profile',
        maxCount: 1,
      },
      {
        name: 'cover',
        maxCount: 5,
      },
    ]),
  ],
  UserController.UpdateUser
);
UsersRouter.patch('/updatewithpass', UserController.UpdateWithPass);
UsersRouter.patch('/updatepassbyadmin', UserController.UpdatePassByAdmin);
UsersRouter.post('/delete', UserController.DeleteUser);
UsersRouter.post('/itemnotification', UserController.ItemNotification);
UsersRouter.post('/togglenotification', UserController.ToggleNotification);
UsersRouter.post('/validatephone', UserController.ValidatePhone);
UsersRouter.post('/sendotp', UserController.SendOTP);
// UsersRouter.put('/updateall', UserController.updateall);
module.exports = UsersRouter;
