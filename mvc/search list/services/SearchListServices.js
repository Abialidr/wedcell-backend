var q = require("q");
var SearchListModels = require("../models/SearchListModels");

function SearchListServices() {
  async function GetOne(condition) {
    // var deferred = q.defer();
    try {
      return await SearchListModels.findOne(condition);
    } catch (error) {
      console.error(`🚀 ~ file: UserServices.js:46 ~ GetUser ~ error:`, error);

      return error;
    }
  }
  async function GetMany(condition) {
    // var deferred = q.defer();
    try {
      return await SearchListModels.find(condition);
    } catch (error) {
      console.error(`🚀 ~ file: UserServices.js:46 ~ GetUser ~ error:`, error);

      return error;
    }
  }
  async function GetManyWithPagination(condition, page, skip) {
    try {
      return await SearchListModels.find(condition)
        .skip((page - 1) * skip)
        .limit(skip);
    } catch (error) {
      console.error(`🚀 ~ file: UserServices.js:46 ~ GetUser ~ error:`, error);

      return error;
    }
  }

  async function UpdateUser(condition, data) {
    try {
      return await SearchListModels.findOneAndUpdate(condition, data, {
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
      return await SearchListModels.create(data);
    } catch (error) {
      console.error(`🚀 ~ file: UserServices.js:46 ~ GetUser ~ error:`, error);

      return error;
    }
  }
  async function countDocuments(condition) {
    try {
      return await SearchListModels.countDocuments(condition);
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
  };
}

module.exports = SearchListServices();
