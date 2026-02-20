var q = require('q');
var InvitesModels = require('../models/InvitesImgModels');

function InvitationServices() {
  async function GetOne(condition) {
    // var deferred = q.defer();
    try {
      return await InvitesModels.findOne(condition);
    } catch (error) {
      console.error(`🚀 ~ file: UserServices.js:46 ~ GetUser ~ error:`, error);

      return error;
    }
  }
  async function GetMany(condition) {
    // var deferred = q.defer();
    try {
      return await InvitesModels.find(condition);
    } catch (error) {
      console.error(`🚀 ~ file: UserServices.js:46 ~ GetUser ~ error:`, error);

      return error;
    }
  }

  async function Update(condition, data) {
    try {
      return await InvitesModels.findOneAndUpdate(condition, data, {
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
      return await InvitesModels.deleteOne(condition);
    } catch (error) {
      console.error(`🚀 ~ file: UserServices.js:46 ~ GetUser ~ error:`, error);

      return error;
    }
  }
  async function Create(data) {
    try {
      return await InvitesModels.create(data);
    } catch (error) {
      console.error(`🚀 ~ file: UserServices.js:46 ~ GetUser ~ error:`, error);

      return error;
    }
  }
  async function countDocuments(condition) {
    try {
      return await InvitesModels.countDocuments(condition);
    } catch (error) {
      console.error(`🚀 ~ file: UserServices.js:46 ~ GetUser ~ error:`, error);

      return error;
    }
  }
  async function GetManyWithPagination(condition, page, skip) {
    // var deferred = q.defer();
    try {
      return await InvitesModels.find(condition)
        .skip((page - 1) * skip)
        .limit(skip);
    } catch (error) {
      console.error(`🚀 ~ file: UserServices.js:46 ~ GetUser ~ error:`, error);

      return error;
    }
  }

  return {
    GetOne,
    Update,
    GetMany,
    Create,
    countDocuments,
    Delete,
    GetManyWithPagination,
  };
}

module.exports = InvitationServices();
