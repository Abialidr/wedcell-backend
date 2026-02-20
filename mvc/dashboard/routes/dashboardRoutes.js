var express = require('express');
var OrdersRouter = express.Router();
var DashboardControllers = require('../controllers/dashboardControllers');
var auth = require('../../../middleware/auth');

OrdersRouter.post('/analyticsbar', auth, DashboardControllers.GetAnalyticsBar);
OrdersRouter.post('/analytics', auth, DashboardControllers.GetAnalytics);
OrdersRouter.post('/notification', auth, DashboardControllers.GetNotification);
module.exports = OrdersRouter;
