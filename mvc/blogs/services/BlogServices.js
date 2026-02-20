var q = require("q");
var BlogModels = require("../models/BlogsModel");

function BlogsServices() {

  function CreateBlogs(data) {
    var deferred = q.defer();
    BlogModels.create(data)
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

  function GetBlogs(condition) {
    var deferred = q.defer();
    BlogModels.find(condition)
      .then(function (result) {
        var resp = {
          success: true,
          message: "Blogs Gets Successfully",
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

  function UpdateBlogs(condition, data) {
    var deferred = q.defer();
    BlogModels.findOneAndUpdate(condition, { $set: data }, { useFindAndModify: false })
      .then(function (result) {
        var resp = {
          success: true,
          message: "Update Blogs Successfully",
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

  function DeleteBlogs(condition, data) {
    var deferred = q.defer();
    BlogModels.findOneAndUpdate(condition, { $set: data })
      .then(function (result) {
        var resp = {
          success: true,
          message: "Delete Blogs Successfully",
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
    CreateBlogs: CreateBlogs,
    GetBlogs: GetBlogs,
    UpdateBlogs: UpdateBlogs,
    DeleteBlogs: DeleteBlogs,
  };
}

module.exports = BlogsServices();
