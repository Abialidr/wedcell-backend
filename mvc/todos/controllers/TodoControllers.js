var {
  GetOne,
  Update,
  GetMany,
  Create,
  countDocuments,
  Delete,
} = require('../services/TodoServices');
var moment = require('moment');
module.exports = {
  CreateTodos: async function (req, res) {
    try {
      data = req.body;
      if (!data.title || !data.category || !data.dueDate) {
        return res.status(400).send({
          success: false,
          message: 'invalid data',
          data: {},
        });
      }
      data.userId = req.user._id;
      data.completed = false;

      const todo = await Create(data);
      if (todo) {
        return res.status(200).send({
          success: true,
          message: 'todo added successfully',
          data: todo,
        });
      }
    } catch (error) {
      console.error(
        `🚀 ~ file: CustomerControllers.js:64 ~ CreateAccount: ~ error:`,
        error
      );
      res.status(400).send({
        message: 'Something went wrong',
        error,
        data: [],
        success: false,
      });
    }
  },
  UpdateTodos: async function (req, res) {
    try {
      data = req.body;
      if (!data.title || !data.category || !data.dueDate || !data.id) {
        return res.status(400).send({
          success: false,
          message: 'invalid data',
          data: {},
        });
      }
      const condition = {
        _id: data.id,
      };
      delete data.id;
      const todo = await Update(condition, data);

      if (todo) {
        return res.status(200).send({
          success: true,
          message: 'todo Updated successfully',
          data: todo,
        });
      }
    } catch (error) {
      console.error(
        `🚀 ~ file: CustomerControllers.js:64 ~ CreateAccount: ~ error:`,
        error
      );
      res.status(400).send({
        message: 'Something went wrong',
        error,
        data: [],
        success: false,
      });
    }
  },
  CheckedTodos: async function (req, res) {
    try {
      data = req.body;
      if (!data.id || data.completed === undefined) {
        return res.status(400).send({
          success: false,
          message: 'invalid data',
          data: {},
        });
      }
      const condition = {
        _id: data.id,
      };
      delete data.id;
      data.completedOn = data.completed ? moment().format() : '';
      const todo = await Update(condition, data);
      if (todo) {
        return res.status(200).send({
          success: true,
          message: 'todo Updated successfully',
          data: todo,
        });
      }
    } catch (error) {
      console.error(
        `🚀 ~ file: CustomerControllers.js:64 ~ CreateAccount: ~ error:`,
        error
      );
      res.status(400).send({
        message: 'Something went wrong',
        error,
        data: [],
        success: false,
      });
    }
  },
  DeleteTodo: async function (req, res) {
    try {
      const condition = { _id: req.params.id };
      const deleted = await Delete(condition);
      if (deleted.n) {
        return res.status(200).send({
          success: true,
          message: 'todo Deleted successfully',
          data: deleted,
        });
      } else {
        return res.status(200).send({
          success: false,
          message: 'todo Deleted unsuccessfully',
          data: deleted,
        });
      }
    } catch (error) {
      console.error(
        `🚀 ~ file: CustomerControllers.js:64 ~ CreateAccount: ~ error:`,
        error
      );
      res.status(400).send({
        message: 'Something went wrong',
        error,
        data: [],
        success: false,
      });
    }
  },
  GetTodos: async function (req, res) {
    try {
      const condition = {
        category: req.body.category,
        userId: req.user._id,
      };
      if (req.body.completed !== undefined) {
        condition.completed = req.body.completed;
      }
      const todos = await GetMany(condition);
      if (todos.length) {
        return res.status(200).send({
          success: true,
          message: 'todo Fetched successfully',
          data: todos,
        });
      } else {
        return res.status(200).send({
          message: 'no todos found',
          data: [],
          success: false,
        });
      }
    } catch (error) {
      console.error(
        `🚀 ~ file: CustomerControllers.js:64 ~ CreateAccount: ~ error:`,
        error
      );
      res.status(400).send({
        message: 'Something went wrong',
        error,
        data: [],
        success: false,
      });
    }
  },
  GetTodos1: async function (req, res) {
    try {
      const condition = {
        category: req.query.category,
        userId: req.user._id,
      };
      if (req.query.completed !== undefined) {
        condition.completed = req.query.completed;
      }
      const todos = await GetMany(condition);
      if (todos.length) {
        return res.status(200).send({
          success: true,
          message: 'todo Fetched successfully',
          data: todos,
        });
      } else {
        return res.status(200).send({
          message: 'no todos found',
          data: [],
          success: false,
        });
      }
    } catch (error) {
      console.error(
        `🚀 ~ file: CustomerControllers.js:64 ~ CreateAccount: ~ error:`,
        error
      );
      res.status(400).send({
        message: 'Something went wrong',
        error,
        data: [],
        success: false,
      });
    }
  },
  CheckCompletedTodo: async function (req, res) {
    try {
      const condition1 = {
        completed: true,
        userId: req.user._id,
      };
      const condition2 = {
        userId: req.user._id,
      };

      const completed = await countDocuments(condition1);
      const all = await countDocuments(condition2);

      if (completed !== undefined && all) {
        return res.status(200).send({
          success: true,
          message: 'successfully',
          data: {
            completed,
            all,
          },
        });
      } else {
        return res.status(400).send({
          message: 'invalid id',
          data: [],
          success: false,
        });
      }
    } catch (error) {
      console.error(
        `🚀 ~ file: CustomerControllers.js:64 ~ CreateAccount: ~ error:`,
        error
      );
      res.status(400).send({
        message: 'Something went wrong',
        error,
        data: [],
        success: false,
      });
    }
  },
  getCartWithRemainingTodos: async function (req, res) {
    try {
      req.query.todos = JSON.parse(req.query.todos);
      if (req.query.todos === undefined || !req.query.todos.length) {
        return res.status(400).send({
          success: false,
          message: 'invalid data',
          data: {},
        });
      }

      let todos = req.query.todos.map(async (data) => {
        const condition = {
          completed: false,
          category: data,
          userId: req.user._id,
        };
        const todo = await countDocuments(condition);
        return {
          name: data,
          remaining: todo,
        };
      });
      todos = await Promise.all(todos);
      const sum = todos.reduce((sum, value) => {
        return sum + value.remaining;
      }, 0);
      if (todos.length) {
        return res.status(200).send({
          success: true,
          message: 'successfully',
          data: todos,
          sum,
        });
      } else {
        return res.status(400).send({
          message: 'invalid id',
          data: [],
          success: false,
        });
      }
    } catch (error) {
      console.error(
        `🚀 ~ file: CustomerControllers.js:64 ~ CreateAccount: ~ error:`,
        error
      );
      res.status(400).send({
        message: 'Something went wrong',
        error,
        data: [],
        success: false,
      });
    }
  },
};
