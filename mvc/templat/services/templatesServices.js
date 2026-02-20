var q = require('q');
var TemplateModal = require('../models/templatesModels');

function TemplatesServices() {
  async function GetOne(condition) {
    // var deferred = q.defer();
    try {
      return await TemplateModal.findOne(condition);
    } catch (error) {
      console.error(`🚀 ~ file: UserServices.js:46 ~ GetUser ~ error:`, error);

      return error;
    }
  }
  async function GetManyWithPagination(condition, page, skip) {
    // var deferred = q.defer();
    try {
      return await TemplateModal.find(condition)
        .skip((page - 1) * skip)
        .limit(skip);
    } catch (error) {
      console.error(`🚀 ~ file: UserServices.js:46 ~ GetUser ~ error:`, error);

      return error;
    }
  }
  async function GetMany(condition) {
    // var deferred = q.defer();
    try {
      return await TemplateModal.find(condition);
    } catch (error) {
      console.error(`🚀 ~ file: UserServices.js:46 ~ GetUser ~ error:`, error);

      return error;
    }
  }

  async function Update(condition, data) {
    try {
      return await TemplateModal.findOneAndUpdate(condition, data, {
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
      return await TemplateModal.deleteOne(condition);
    } catch (error) {
      console.error(`🚀 ~ file: UserServices.js:46 ~ GetUser ~ error:`, error);

      return error;
    }
  }
  async function Create(data) {
    try {
      return await TemplateModal.create(data);
    } catch (error) {
      console.error(`🚀 ~ file: UserServices.js:46 ~ GetUser ~ error:`, error);

      return error;
    }
  }
  async function countDocuments(condition) {
    try {
      return await TemplateModal.countDocuments(condition);
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

module.exports = TemplatesServices();
