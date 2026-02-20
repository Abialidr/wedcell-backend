var q = require("q");
var FamilyModal = require("../models/FamilyModels");

function FamilysServices() {
  async function GetOne(condition) {
    // var deferred = q.defer();
    try {
      return await FamilyModal.findOne(condition);
    } catch (error) {
      console.error(`🚀 ~ file: UserServices.js:46 ~ GetUser ~ error:`, error);

      return error;
    }
  }
  async function GetMany(condition) {
    // var deferred = q.defer();
    try {
      return await FamilyModal.find(condition);
    } catch (error) {
      console.error(`🚀 ~ file: UserServices.js:46 ~ GetUser ~ error:`, error);

      return error;
    }
  }

  async function Update(condition, data) {
    try {
      return await FamilyModal.findOneAndUpdate(condition, data, {
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
      return await FamilyModal.deleteOne(condition);
    } catch (error) {
      console.error(`🚀 ~ file: UserServices.js:46 ~ GetUser ~ error:`, error);

      return error;
    }
  }
  async function Create(data) {
    try {
      return await FamilyModal.create(data);
    } catch (error) {
      console.error(`🚀 ~ file: UserServices.js:46 ~ dxfgdfgdfgd:`, error);

      return error;
    }
  }
  async function countDocuments(condition) {
    try {
      return await FamilyModal.countDocuments(condition);
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

module.exports = FamilysServices();
