var express = require('express');
var VenueUserRoutes = express.Router();
var VenueUserContoller = require('../controllers/VenueUserControllers');
const uploadMulter = require('../../../middleware/imageUpload');
const auth = require('../../../middleware/auth');
const admin = require('../../../middleware/admin');
const album = [];
const amenities = [];
for (let index = 0; index < 20; index++) {
  album.push({
    name: `album${index}`,
    maxCount: 50,
  });
}
for (let index = 0; index < 20; index++) {
  amenities.push({
    name: `amenities${index}`,
    maxCount: 50,
  });
}
VenueUserRoutes.post(
  '/create',
  uploadMulter.fields([
    ...album,
    ...amenities,
    {
      name: 'menu',
      maxCount: 50,
    },
    {
      name: 'lmenu',
      maxCount: 50,
    },
    {
      name: 'brochure',
      maxCount: 1,
    },
    {
      name: 'gallery',
      maxCount: 50,
    },
    {
      name: 'main',
      maxCount: 1,
    },
  ]),

  VenueUserContoller.CreateAccount
);
VenueUserRoutes.put(
  '/update',
  [
    auth,
    uploadMulter.fields([
      ...amenities,
      ...album,
      {
        name: 'menu',
        maxCount: 50,
      },
      {
        name: 'lmenu',
        maxCount: 50,
      },
      {
        name: 'brochure',
        maxCount: 1,
      },
      {
        name: 'gallery',
        maxCount: 50,
      },
      {
        name: 'main',
        maxCount: 1,
      },
    ]),
  ],
  VenueUserContoller.updateUser
);

VenueUserRoutes.post('/login', VenueUserContoller.UserLogin);
VenueUserRoutes.delete('/delete/:id', auth, VenueUserContoller.deleteUser);
VenueUserRoutes.get('/verifyNumber', auth, VenueUserContoller.verifyNumber);
VenueUserRoutes.get('/verifyEmail', auth, VenueUserContoller.verifyEmail);
VenueUserRoutes.post('/get', auth, VenueUserContoller.GetItemsForVendors);
VenueUserRoutes.post('/getall', VenueUserContoller.GetItemsAll);
VenueUserRoutes.get('/getall', VenueUserContoller.GetItemsAll1);
VenueUserRoutes.get('/fullTextSearch/:id', VenueUserContoller.fullTextSearch);
VenueUserRoutes.get('/dashboarddata/:_id', VenueUserContoller.getDashboardData);
VenueUserRoutes.put('/updatewithpass', auth, VenueUserContoller.UpdateWithPass);
VenueUserRoutes.put(
  '/updatepassbyadmin',
  [auth, admin],
  VenueUserContoller.UpdatePassByAdmin
);
VenueUserRoutes.put('/forgotpassword', VenueUserContoller.forgotPassword);
VenueUserRoutes.put('/updateall', VenueUserContoller.updateall);

// ShopNowUserRoutes.post('/delete', ShopNowUserContoller.DeleteUser);

module.exports = VenueUserRoutes;
