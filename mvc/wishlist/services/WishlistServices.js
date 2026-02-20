var q = require("q");
var WishlistModels = require("../models/WishlistModel");

function WishlistsServices() {
  function CreateWishlists(data) {
    var deferred = q.defer();
    WishlistModels.create(data)
      .then(function (result) {
        var resp = {
          success: true,
          message: "You are Cart Successfully Created",
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

  function UpdateWishlists(data) {
    var deferred = q.defer();
    WishlistModels.findByIdAndUpdate(data._id, data)
      .then(function (result) {
        var resp = {
          success: true,
          message: "You are Wishlist Successfully Updated",
          // data: result,
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

  function GetWishlists(condition) {
    var deferred = q.defer();
    WishlistModels.find(condition)
      .then(function (result) {
        var resp = {
          success: true,
          message: "Wishlists Gets Successfully",
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
        deferred.resolve(resp);
      });
    return deferred.promise;
  }

  function DeleteWishlist(id) {
    var deferred = q.defer();
    WishlistModels.findByIdAndDelete(id, function (err, docs) {
      if (err) {
        var resp = {
          success: false,
          message: "Error in processing",
          data: err,
        };
        deferred.reject(resp);
        console.error(err);
      } else {
        var resp = {
          success: true,
          message: "Wishlists Successfully deleted",
        };
        deferred.resolve(resp);
      }
    });

    return deferred.promise;
  }

  return {
    CreateWishlists,
    GetWishlists,
    UpdateWishlists,
    DeleteWishlist,
  };
}

module.exports = WishlistsServices();
