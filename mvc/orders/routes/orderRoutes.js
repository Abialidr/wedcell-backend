var express = require('express');
var OrdersRouter = express.Router();
var OrderControllers = require('../controllers/orderControllers');
var auth = require('../../../middleware/auth');

/**
 * Users routes
 */
OrdersRouter.get('/user/get', auth, OrderControllers.GetUserOrders);

OrdersRouter.post('/create', auth, OrderControllers.CreateOrders);
OrdersRouter.post('/get', auth, OrderControllers.GetOrders);
OrdersRouter.post('/getcount', auth, OrderControllers.GetOrdersCount);
OrdersRouter.post('/getorderseller', auth, OrderControllers.GetOrdersSellerdash);
OrdersRouter.post('/getorderadmin', auth, OrderControllers.GetOrdersForAdmin);
OrdersRouter.post('/single', auth, OrderControllers.GetOrderSingle);
OrdersRouter.post('/update', auth, OrderControllers.UpdateOrders);
OrdersRouter.post('/delete', auth, OrderControllers.DeleteOrders);
OrdersRouter.post('/changestatus', auth, OrderControllers.ChangeOrderStatus);
OrdersRouter.post('/create_invoice', auth, OrderControllers.CreateInvoice);

module.exports = OrdersRouter;
