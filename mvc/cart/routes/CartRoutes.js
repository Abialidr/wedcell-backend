var express = require('express');
var CartRouter = express.Router();
var CartControllers = require('../controllers/CartControllers');
const auth = require('../../../middleware/auth');
// var UtilsServices = require("../../utils/services/UtilsServices");

CartRouter.post('/', auth, CartControllers.CreateCarts);
CartRouter.patch('/', auth, CartControllers.UpdateCarts);
CartRouter.delete('/:id', auth, CartControllers.DeleteCart);
CartRouter.get('/', auth, CartControllers.GetCarts);
CartRouter.get('/:id', auth, CartControllers.GetCart);
CartRouter.get('/checkCart/:id', auth, CartControllers.CheckCart);

module.exports = CartRouter;
