var q = require('q');
var CryptoJS = require('crypto-js');
var config = require('../../../config/config');
var CategoryModels = require('../models/CategoryModels');
var jwt = require('jsonwebtoken')
var _ = require('underscore');

function CategoryServices() {

  function GetCategory(condition) {
    var deferred = q.defer();
    CategoryModels.find(condition).then(function (result) {
      var resp = {
        success: true,
        message: 'Category Gets Successfully',
        data: result
      };
      deferred.resolve(resp);
    }).catch(function (error) {
      var resp = {
        success: false,
        message: 'Error in processing',
        data: error
      };
      deferred.reject(resp);
    });
    return deferred.promise;
  };

  function CreateCategory(data) {
    var deferred = q.defer();

    CategoryModels.create(data).then(function (result) {
      var resp = {
        success: true,
        message: 'Create category Successfully',
        data: result
      };
      deferred.resolve(resp);
    }).catch(function (error) {
      var resp = {
        success: false,
        message: 'Error in processing',
        data: error
      };
      deferred.reject(resp);
    });
    return deferred.promise;
  };

  function UpdateCategory(condition, data) {
    var deferred = q.defer();
    CategoryModels.findOneAndUpdate(condition, { $set: data }).then(function (result) {
      var resp = {
        success: true,
        message: 'Update category Successfully',
        data: result
      };
      deferred.resolve(resp);
    }).catch(function (error) {
      var resp = {
        success: false,
        message: 'Error in processing',
        data: error
      };
      deferred.reject(resp);
    });
    return deferred.promise;
  };

  function DeleteCategory(condition, data) {
    var deferred = q.defer();
    CategoryModels.findOneAndUpdate(condition, { $set: data }).then(function (result) {
      var resp = {
        success: true,
        message: 'Delete category Successfully',
        data: result
      };
      deferred.resolve(resp);
    }).catch(function (error) {
      var resp = {
        success: false,
        message: 'Error in processing',
        data: error
      };
      deferred.reject(resp);
    });
    return deferred.promise;
  };

  return {
    GetCategory: GetCategory,
    CreateCategory: CreateCategory,
    UpdateCategory: UpdateCategory,
    DeleteCategory: DeleteCategory

  };
};

module.exports = CategoryServices();
