var q = require("q");
var productModels = require("../model/productModel");
const orderModels = require("../../orders/models/orderModels");

function ProductServices() {
  function CreateProducts(data) {
    var deferred = q.defer();
    productModels.create(data)
      .then(function (result) {
        var resp = {
          success: true,
          message: "You are Item Successfully",
          data: result,
        };
        deferred.resolve(resp);
      })
      .catch(function (error) {
        var resp = {
          success: false,
          message: "Error in processing",
          data: error,
        };
        deferred.reject(resp);
      });
    return deferred.promise;
  }

  function GetProductsById(id) {
    var deferred = q.defer();
    productModels.findByID(id)
      .then(function (result) {
        var resp = {
          success: true,
          message: "Products Gets Successfully",
          data: result,
        };
        deferred.resolve(resp);
      })
      .catch(function (error) {
        var resp = {
          success: false,
          message: "Error in processing",
          data: error,
        };
        deferred.reject(resp);
      });
    return deferred.promise;
  }
  function GetProducts(condition) {
    var deferred = q.defer();
    productModels.find(condition)
      .then(function (result) {
        var resp = {
          success: true,
          message: "Products Gets Successfully",
          data: result,
        };
        deferred.resolve(resp);
      })
      .catch(function (error) {
        var resp = {
          success: false,
          message: "Error in processing",
          data: error,
        };
        deferred.reject(resp);
      });
    return deferred.promise;
  }

  function UpdateProducts(condition, data) {
    var deferred = q.defer();
    productModels.findOneAndUpdate(condition, { $set: data }, { useFindAndModify: false })
      .then(function (result) {
        var resp = {
          success: true,
          message: "Update Products Successfully",
          data: result,
        };
        deferred.resolve(resp);
      })
      .catch(function (error) {
        var resp = {
          success: false,
          message: "Error in processing",
          data: error,
        };
        deferred.reject(resp);
      });
    return deferred.promise;
  }

  function DeleteProducts(condition, data) {
    var deferred = q.defer();
    productModels.findOneAndUpdate(condition, { $set: data })
      .then(function (result) {
        var resp = {
          success: true,
          message: "Delete Products Successfully",
          data: result,
        };
        deferred.resolve(resp);
      })
      .catch(function (error) {
        var resp = {
          success: false,
          message: "Error in processing",
          data: error,
        };
        deferred.reject(resp);
      });
    return deferred.promise;
  }

  return {
    CreateProducts: CreateProducts,
    GetProducts: GetProducts,
    UpdateProducts: UpdateProducts,
    DeleteProducts: DeleteProducts,
    GetProductsById:GetProductsById
  };
}

module.exports = ProductServices();
