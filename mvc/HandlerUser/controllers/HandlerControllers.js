var {
  GetOne,
  Update,
  GetMany,
  Create,
  countDocuments,
  Delete,
} = require("../services/HandlerServices");
var moment = require("moment");
module.exports = {
  CreateUser: async function (req, res) {
    try {
      const data = req.body;
      const UsersVendor = await GetMany({ vendorId: data.vendorId });
      const Users = await GetMany({
        contact: data.contact,
        vendorId: data.vendorId,
      });
      if (UsersVendor.length < 5) {
        if (!Users?.length) {
          const add = await Create(data);
          res.status(200).send({
            success: true,
            message: "Guest Added successfully",
            data: add,
          });
        } else {
          res.status(400).send({
            success: false,
            message: "User Already Exist",
          });
        }
      } else {
        res.status(400).send({
          success: false,
          message: "Only Five User allowed",
        });
      }
    } catch (error) {
      console.error(
        `🚀 ~ file: CustomerControllers.js:64 ~ CreateAccount: ~ error:`,
        error
      );
      res.status(400).send({
        message: "Something went wrong",
        error,
        data: [],
        success: false,
      });
    }
  },
  UpdateUser: async function (req, res) {
    try {
      const data = req.body;
      const update = await Update({ _id: data._id }, data);
      res.status(200).send({
        success: true,
        message: "User Updated successfully",
        data: update,
      });
    } catch (error) {
      console.error(
        `🚀 ~ file: CustomerControllers.js:64 ~ CreateAccount: ~ error:`,
        error
      );
      res.status(400).send({
        message: "Something went wrong",
        error,
        data: [],
        success: false,
      });
    }
  },
  DeleteUser: async function (req, res) {
    try {
      const deleteUser = await Delete({ _id: req.params.id });
      res.status(200).send({
        success: true,
        message: "User Deleted successfully",
        data: deleteUser,
      });
    } catch (error) {
      console.error(
        `🚀 ~ file: CustomerControllers.js:64 ~ CreateAccount: ~ error:`,
        error
      );
      res.status(400).send({
        message: "Something went wrong",
        error,
        data: [],
        success: false,
      });
    }
  },
  GetUsers: async function (req, res) {
    try {
      let condition = {
        vendorId: req.query.vId,
      };
      if (req.query.uId) {
        condition = { _id: req.query.uId };
      }
      const Users = await GetMany(condition);
      if (Users.length) {
        return res.status(200).send({
          success: true,
          message: "Users Fetched successfully",
          data: Users,
        });
      } else {
        return res.status(200).send({
          message: "no Users found",
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
        message: "Something went wrong",
        error,
        data: [],
        success: false,
      });
    }
  },
};
