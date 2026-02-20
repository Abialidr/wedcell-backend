var q = require("q");
var ShopNowUserModels = require("../models/ShopNowUserModels");

function ShopNowUserServices() {
  async function GetOne(condition) {
    // var deferred = q.defer();
    try {
      return await ShopNowUserModels.findOne(condition);
    } catch (error) {
      console.error(`🚀 ~ file: UserServices.js:46 ~ GetUser ~ error:`, error);

      return error;
    }
  }
  async function GetMany(condition) {
    // var deferred = q.defer();
    try {
      return await ShopNowUserModels.find(condition);
    } catch (error) {
      console.error(`🚀 ~ file: UserServices.js:46 ~ GetUser ~ error:`, error);

      return error;
    }
  }
  async function GetManyWithPagination(condition, page) {
    // var deferred = q.defer();
    try {
      return await ShopNowUserModels.find(condition)
        .skip((page - 1) * 20)
        .limit(20);
    } catch (error) {
      console.error(`🚀 ~ file: UserServices.js:46 ~ GetUser ~ error:`, error);

      return error;
    }
  }
  async function DeleteOne(id) {
    // var deferred = q.defer();
    try {
      return await ShopNowUserModels.findByIdAndDelete(id);
    } catch (error) {
      console.error(`🚀 ~ file: UserServices.js:46 ~ GetUser ~ error:`, error);
      return error;
    }
  }
  async function UpdateUser(condition, data) {
    try {
      return await ShopNowUserModels.findOneAndUpdate(condition, data, {
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
      return await ShopNowUserModels.create(data);
    } catch (error) {
      console.error(`🚀 ~ file: UserServices.js:46 ~ GetUser ~ error:`, error);

      return error;
    }
  }
  async function countDocuments(condition) {
    try {
      return await ShopNowUserModels.countDocuments(condition);
    } catch (error) {
      console.error(`🚀 ~ file: UserServices.js:46 ~ GetUser ~ error:`, error);

      return error;
    }
  }
  const RefreshUser = (user) => {
    const ShopNowUser = JSON.parse(JSON.stringify(user));
    delete ShopNowUser["password"];
    delete ShopNowUser["is_approved"];
    delete ShopNowUser["is_delete"];
    delete ShopNowUser["createdAt"];
    delete ShopNowUser["updatedAt"];
    delete ShopNowUser["__v"];
    return ShopNowUser;
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

module.exports = ShopNowUserServices();
