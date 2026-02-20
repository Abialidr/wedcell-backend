var express = require('express');
var BudgetRouter = express.Router();
var BudgetControllers = require('../controllers/BudgetControllers');
const auth = require('../../../middleware/auth');
// var UtilsServices = require("../../utils/services/UtilsServices");

BudgetRouter.post('/categories/add', auth, BudgetControllers.CreateCategory);
BudgetRouter.post('/subcat/add', auth, BudgetControllers.CreateSubCategory);

BudgetRouter.put('/categories/update', auth, BudgetControllers.UpdateCategory);
BudgetRouter.put(
  '/updatetea',
  auth,
  BudgetControllers.UpdateTotal_Estimated_Amount
);
BudgetRouter.put('/subcat/update', auth, BudgetControllers.UpdateSubCategory);
BudgetRouter.put('/subcat/notes', auth, BudgetControllers.NotesSubCategory);

BudgetRouter.delete(
  '/categories/delete/:id',
  auth,
  BudgetControllers.DeleteCategory
);
BudgetRouter.delete(
  '/subcat/delete/:cid/:id',
  auth,
  BudgetControllers.DeleteSubCategory
);

BudgetRouter.get('/categories', auth, BudgetControllers.GetCategory);
BudgetRouter.get('/subcat/:id', auth, BudgetControllers.GetSubCategory);

module.exports = BudgetRouter;
