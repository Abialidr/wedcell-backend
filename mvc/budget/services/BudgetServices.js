const { BudgetCategory, BudgetSubCategory } = require('../models/BudgetModel');

function BudgetServices() {
  async function GetOneCategory(condition) {
    // var deferred = q.defer();
    try {
      return await BudgetCategory.findOne(condition);
    } catch (error) {
      console.log(`🚀 ~ file: UserServices.js:46 ~ GetUser ~ error:`, error);

      return error;
    }
  }
  async function GetManyCategory(condition) {
    // var deferred = q.defer();
    try {
      return await BudgetCategory.find(condition);
    } catch (error) {
      console.log(`🚀 ~ file: UserServices.js:46 ~ GetUser ~ error:`, error);

      return error;
    }
  }
  async function UpdateCategory(condition, data) {
    try {
      return await BudgetCategory.findOneAndUpdate(condition, data, {
        useFindAndModify: false,
        new: true,
      });
    } catch (error) {
      console.log(`🚀 ~ file: UserServices.js:46 ~ GetUser ~ error:`, error);

      return error;
    }
  }
  async function DeleteCategory(condition, data) {
    try {
      return await BudgetCategory.deleteOne(condition);
    } catch (error) {
      console.log(`🚀 ~ file: UserServices.js:46 ~ GetUser ~ error:`, error);

      return error;
    }
  }
  async function CreateCategory(data) {
    try {
      return await BudgetCategory.create(data);
    } catch (error) {
      console.log(`🚀 ~ file: UserServices.js:46 ~ GetUser ~ error:`, error);

      return error;
    }
  }
  async function countDocumentsCategory(condition) {
    try {
      return await BudgetCategory.countDocuments(condition);
    } catch (error) {
      console.log(`🚀 ~ file: UserServices.js:46 ~ GetUser ~ error:`, error);

      return error;
    }
  }

  async function GetOneSubCategory(condition) {
    // var deferred = q.defer();
    try {
      return await BudgetSubCategory.findOne(condition);
    } catch (error) {
      console.log(`🚀 ~ file: UserServices.js:46 ~ GetUser ~ error:`, error);

      return error;
    }
  }
  async function GetManySubCategory(condition) {
    // var deferred = q.defer();
    try {
      return await BudgetSubCategory.find(condition);
    } catch (error) {
      console.log(`🚀 ~ file: UserServices.js:46 ~ GetUser ~ error:`, error);

      return error;
    }
  }
  async function UpdateSubCategory(condition, data) {
    try {
      return await BudgetSubCategory.findOneAndUpdate(condition, data, {
        useFindAndModify: false,
        new: true,
      });
    } catch (error) {
      console.log(`🚀 ~ file: UserServices.js:46 ~ GetUser ~ error:`, error);

      return error;
    }
  }
  async function DeleteSubCategory(condition, data) {
    try {
      return await BudgetSubCategory.deleteOne(condition);
    } catch (error) {
      console.log(`🚀 ~ file: UserServices.js:46 ~ GetUser ~ error:`, error);

      return error;
    }
  }
  async function CreateSubCategory(data) {
    try {
      return await BudgetSubCategory.create(data);
    } catch (error) {
      console.log(`🚀 ~ file: UserServices.js:46 ~ GetUser ~ error:`, error);

      return error;
    }
  }
  async function countDocumentsSubCategory(condition) {
    try {
      return await BudgetSubCategory.countDocuments(condition);
    } catch (error) {
      console.log(`🚀 ~ file: UserServices.js:46 ~ GetUser ~ error:`, error);

      return error;
    }
  }

  return {
    GetOneCategory,
    GetManyCategory,
    UpdateCategory,
    DeleteCategory,
    CreateCategory,
    countDocumentsCategory,
    GetOneSubCategory,
    GetManySubCategory,
    UpdateSubCategory,
    DeleteSubCategory,
    CreateSubCategory,
    countDocumentsSubCategory,
  };
}

module.exports = BudgetServices();
