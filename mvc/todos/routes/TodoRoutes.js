var express = require('express');
var TodoRouter = express.Router();
var TodoControllers = require('../controllers/TodoControllers');
const auth = require('../../../middleware/auth');
// var UtilsServices = require("../../utils/services/UtilsServices");

TodoRouter.post('/', auth, TodoControllers.CreateTodos);
TodoRouter.put('/update', auth, TodoControllers.UpdateTodos);
TodoRouter.put('/checked', auth, TodoControllers.CheckedTodos);
TodoRouter.delete('/:id', auth, TodoControllers.DeleteTodo);
TodoRouter.put('/', auth, TodoControllers.GetTodos);
TodoRouter.get('/getBycondition', auth, TodoControllers.GetTodos1);
// TodoRouter.get('/:id', auth, TodoControllers.GetTodo);
TodoRouter.get('/', auth, TodoControllers.CheckCompletedTodo);
TodoRouter.get('/rtodos', auth, TodoControllers.getCartWithRemainingTodos);

module.exports = TodoRouter;
