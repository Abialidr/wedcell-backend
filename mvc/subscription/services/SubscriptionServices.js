var q = require("q");
var SubscriptionModel = require("../models/subscriptionModel");

function SubscriptionServices() {

  function CreateSubscription(data) {
    var deferred = q.defer();
    SubscriptionModel.create(data)
      .then(function (result) {
        var resp = {
          success: true,
          message: "You are Blog Successfully",
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

  function GetSubscription(condition) {
    var deferred = q.defer();
    SubscriptionModel.find(condition)
      .then(function (result) {
        var resp = {
          success: true,
          message: "Subscription Gets Successfully",
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

  function UpdateSubscription(id, data) {
    var deferred = q.defer();
    // SubscriptionModel.findOneAndUpdate(condition, { $set: data }, { useFindAndModify: false })
    SubscriptionModel.updateOne({ _id: id }, data)
      .then(function (result) {
        var resp = {
          success: true,
          message: "Update Subscription Successfully",
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

  function DeleteSubscription(condition, data) {
    var deferred = q.defer();
    SubscriptionModel.updateOne({ _id: id }, data)
      .then(function (result) {
        var resp = {
          success: true,
          message: "Delete Subscription Successfully",
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
    CreateSubscription: CreateSubscription,
    GetSubscription: GetSubscription,
    UpdateSubscription: UpdateSubscription,
    DeleteSubscription: DeleteSubscription,
  };
}

module.exports = SubscriptionServices();
