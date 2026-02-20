var q = require("q");
var InviteTextModal = require("../models/InviteTextModels");

function InviteTextsServices() {
  async function GetOne(condition) {
    // var deferred = q.defer();
    try {
      return await InviteTextModal.findOne(condition);
    } catch (error) {
      console.error(`🚀 ~ file: UserServices.js:46 ~ GetUser ~ error:`, error);

      return error;
    }
  }
  async function GetMany(condition) {
    // var deferred = q.defer();
    try {
      return await InviteTextModal.find(condition);
    } catch (error) {
      console.error(`🚀 ~ file: UserServices.js:46 ~ GetUser ~ error:`, error);

      return error;
    }
  }

  async function Update(condition, data) {
    try {
      return await InviteTextModal.findOneAndUpdate(condition, data, {
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
      return await InviteTextModal.deleteOne(condition);
    } catch (error) {
      console.error(`🚀 ~ file: UserServices.js:46 ~ GetUser ~ error:`, error);

      return error;
    }
  }
  async function Create(data) {
    try {
      return await InviteTextModal.create(data);
    } catch (error) {
      console.error(`🚀 ~ file: UserServices.js:46 ~ dxfgdfgdfgd:`, error);

      return error;
    }
  }
  async function countDocuments(condition) {
    try {
      return await InviteTextModal.countDocuments(condition);
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
  };
}

module.exports = InviteTextsServices();
