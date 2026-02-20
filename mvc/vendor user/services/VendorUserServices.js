var q = require("q");
var VendorUserModels = require("../models/VendorUserModels");

function VendorUserServices() {
  async function GetOne(condition) {
    // var deferred = q.defer();
    try {
      return await VendorUserModels.findOne(condition);
    } catch (error) {
      console.error(`🚀 ~ file: UserServices.js:46 ~ GetUser ~ error:`, error);

      return error;
    }
  }
  async function DeleteOne(id) {
    // var deferred = q.defer();
    try {
      return await VendorUserModels.findByIdAndDelete(id);
    } catch (error) {
      console.error(`🚀 ~ file: UserServices.js:46 ~ GetUser ~ error:`, error);
      return error;
    }
  }
  async function GetMany(condition) {
    // var deferred = q.defer();
    try {
      return await VendorUserModels.find(condition).sort({ priority: 1 });
    } catch (error) {
      console.error(`🚀 ~ file: UserServices.js:46 ~ GetUser ~ error:`, error);

      return error;
    }
  }
  async function GetManyWithPagination(condition, page, skip) {
    try {
      return await VendorUserModels.find(condition)
        .skip((page - 1) * skip)
        .limit(skip)
        .sort({ priority: 1, _id: 1 });
    } catch (error) {
      console.error(`🚀 ~ file: UserServices.js:46 ~ GetUser ~ error:`, error);

      return error;
    }
  }

  async function UpdateUser(condition, data) {
    try {
      return await VendorUserModels.findOneAndUpdate(condition, data, {
        useFindAndModify: false,
        new: true,
      });
    } catch (error) {
      console.error(`🚀 ~ file: UserServices.js:46 ~ GetUser ~ error:`, error);

      return error;
    }
  }
  async function CreateUser(data) {
    try {
      return await VendorUserModels.create(data);
    } catch (error) {
      console.error(`🚀 ~ file: UserServices.js:46 ~ GetUser ~ error:`, error);

      return error;
    }
  }
  async function countDocuments(condition) {
    try {
      return await VendorUserModels.countDocuments(condition);
    } catch (error) {
      console.error(`🚀 ~ file: UserServices.js:46 ~ GetUser ~ error:`, error);

      return error;
    }
  }
  const RefreshUser = (user) => {
    const VendorUser = JSON.parse(JSON.stringify(user));
    delete VendorUser["password"];
    delete VendorUser["is_approved"];
    delete VendorUser["is_delete"];
    delete VendorUser["createdAt"];
    delete VendorUser["updatedAt"];
    delete VendorUser["__v"];
    return VendorUser;
  };
  return {
    GetOne,
    GetManyWithPagination,
    UpdateUser,
    GetMany,
    CreateUser,
    countDocuments,
    RefreshUser,
    DeleteOne,
  };
}

module.exports = VendorUserServices();
