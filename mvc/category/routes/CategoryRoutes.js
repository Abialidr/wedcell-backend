var express = require('express');
var UsersRouter = express.Router();
var UserController = require('../controllers/CategoryControllers');

/**
 * Users routes
 */
UsersRouter.post('/get', UserController.GetCategory);
UsersRouter.post('/create', UserController.CreateCategory);
UsersRouter.post('/update', UserController.UpdateCategory);
UsersRouter.post('/delete', UserController.DeleteCategory);
module.exports = UsersRouter;
