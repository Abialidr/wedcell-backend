var q = require('q');
var CartModels = require('../models/CartModel');

function CartsServices() {
  function CreateCarts(data) {
    var deferred = q.defer();
    CartModels.create(data)
      .then(function (result) {
        var resp = {
          success: true,
          message: 'You are Cart Successfully Created',
          data: result,
        };
        deferred.resolve(resp);
      })
      .catch(function (error) {
        var resp = {
          success: false,
          message: 'Error in processing',
          data: error,
        };
        deferred.reject(resp);
      });
    return deferred.promise;
  }

  function UpdateCarts(data) {
    var deferred = q.defer();
    CartModels.findByIdAndUpdate(data._id, data)
      .then(function (result) {
        var resp = {
          success: true,
          message: 'You are Cart Successfully Updated',
          // data: result,
        };
        deferred.resolve(resp);
      })
      .catch(function (error) {
        var resp = {
          success: false,
          message: 'Error in processing',
          data: error,
        };
        deferred.reject(resp);
      });
    return deferred.promise;
  }

  function GetCarts(condition) {
    var deferred = q.defer();
    CartModels.find(condition)
      .then(function (result) {
        var resp = {
          success: true,
          message: 'Carts Gets Successfully',
          data: result,
        };
        deferred.resolve(resp);
      })
      .catch(function (error) {
        var resp = {
          success: false,
          message: 'Error in processing',
          data: error,
        };
        deferred.reject(resp);
      });
    return deferred.promise;
  }

  function DeleteCart(id) {
    var deferred = q.defer();
    CartModels.findByIdAndDelete(id, function (err, docs) {
      if (err) {
        var resp = {
          success: false,
          message: 'Error in processing',
          data: err,
        };
        deferred.reject(resp);
        console.error(err);
      } else {
        var resp = {
          success: true,
          message: 'Carts Successfully deleted',
        };
        deferred.resolve(resp);
      }
    });

    return deferred.promise;
  }

  return {
    CreateCarts: CreateCarts,
    GetCarts: GetCarts,
    UpdateCarts,
    DeleteCart,
  };
}

module.exports = CartsServices();
