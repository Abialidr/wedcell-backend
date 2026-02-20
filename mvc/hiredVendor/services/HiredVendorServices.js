var q = require("q");
var HiredVendorModels = require("../models/HiredVendorModel");

function HiredVendorServices() {
  function CreateHiredVendor(data) {
    var deferred = q.defer();
    HiredVendorModels.create(data)
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

  function UpdateHiredVendor(data) {
    var deferred = q.defer();
    HiredVendorModels.findByIdAndUpdate(data._id, data)
      .then(function (result) {
        var resp = {
          success: true,
          message: "You are Hired vendor Successfully Updated",
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

  function GetHiredVendors(condition) {
    var deferred = q.defer();
    HiredVendorModels.find(condition)
      .then(function (result) {
        var resp = {
          success: true,
          message: "Hired Vendor Gets Successfully",
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
  function CountHiredVendors(condition) {
    var deferred = q.defer();
    HiredVendorModels.countDocuments(condition)
      .then(function (result) {
        var resp = {
          success: true,
          message: "Hired Vendor Gets Successfully",
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
  function DeleteHiredVendor(id) {
    var deferred = q.defer();
    HiredVendorModels.findByIdAndDelete(id, function (err, docs) {
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
          message: "Hired Vendor Successfully deleted",
        };
        deferred.resolve(resp);
      }
    });

    return deferred.promise;
  }

  return {
    CreateHiredVendor,
    GetHiredVendors,
    UpdateHiredVendor,
    DeleteHiredVendor,
    CountHiredVendors,
  };
}

module.exports = HiredVendorServices();
