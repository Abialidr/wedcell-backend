var q = require("q");
var OppModel = require("../models/oppModel");

function OppServices() {
  async function GetOne(condition) {
    // var deferred = q.defer();
    try {
      return await OppModel.findOne(condition);
    } catch (error) {
      console.error(`🚀 ~ file: UserServices.js:46 ~ GetUser ~ error:`, error);

      return error;
    }
  }
  async function GetMany(condition) {
    // var deferred = q.defer();
    try {
      return await OppModel.find(condition);
    } catch (error) {
      console.error(`🚀 ~ file: UserServices.js:46 ~ GetUser ~ error:`, error);

      return error;
    }
  }
  async function GetManyWithPagination(condition, page, skip) {
    // var deferred = q.defer();
    try {
      return await OppModel.find(condition)
        .skip((page - 1) * skip)
        .limit(skip)
        .sort({ priority: 1 });
    } catch (error) {
      console.error(`🚀 ~ file: UserServices.js:46 ~ GetUser ~ error:`, error);

      return error;
    }
  }
  async function Update(condition, data) {
    try {
      return await OppModel.findOneAndUpdate(condition, data, {
        useFindAndModify: false,
        new: true,
      });
    } catch (error) {
      console.error(`🚀 ~ file: UserServices.js:46 ~ GetUser ~ error:`, error);

      return error;
    }
  }
  async function Delete(condition, data) {
    try {
      return await OppModel.deleteOne(condition);
    } catch (error) {
      console.error(`🚀 ~ file: UserServices.js:46 ~ GetUser ~ error:`, error);

      return error;
    }
  }
  async function Create(data) {
    try {
      return await OppModel.create(data);
    } catch (error) {
      console.error(`🚀 ~ file: UserServices.js:46 ~ GetUser ~ error:`, error);

      return error;
    }
  }
  async function countDocuments(condition) {
    try {
      return await OppModel.countDocuments(condition);
    } catch (error) {
      console.error(`🚀 ~ file: UserServices.js:46 ~ GetUser ~ error:`, error);

      return error;
    }
  }

  return {
    GetOne,
    Update,
    GetMany,
    GetManyWithPagination,
    Create,
    countDocuments,
    Delete,
  };
}

module.exports = {
  OppServices: OppServices(),
};
