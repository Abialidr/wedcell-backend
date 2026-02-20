var express = require('express');
var ItemsRouter = express.Router();
var ItemControllers = require('../controllers/ItemControllers');
var UtilsServices = require('../../utils/services/UtilsServices');
var auth = require('../../../middleware/auth');
const uploadMulter = require('../../../middleware/imageUpload');
const admin = require('../../../middleware/admin');
const album = [];
for (let index = 0; index < 20; index++) {
  album.push({
    name: `album${index}`,
    maxCount: 50,
  });
}


ItemsRouter.post(
  '/create',
  [
    auth,
    uploadMulter.fields([
      ...album,
      {
        name: 'menu',
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
  ItemControllers.CreateItems
);
ItemsRouter.post(
  '/update',
  [
    auth,
    uploadMulter.fields([
      ...album,
      {
        name: 'menu',
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
  ItemControllers.UpdateItems
);
ItemsRouter.post('/get', auth, ItemControllers.GetItemsForVendors);
ItemsRouter.post('/getall', ItemControllers.GetItemsAll);
ItemsRouter.post('/getallforadmin', ItemControllers.GetItemsAllForAdmin);
ItemsRouter.get('/fullTextSearch/:id', ItemControllers.fullTextSearch);


ItemsRouter.post('/delete', auth, admin, ItemControllers.DeleteItems);
// ItemsRouter.put('/updateallprice', ItemControllers.updateallprice);

module.exports = ItemsRouter;
