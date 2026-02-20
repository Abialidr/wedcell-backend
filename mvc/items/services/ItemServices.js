var q = require("q");
var CryptoJS = require("crypto-js");
var config = require("../../../config/config");
var ItemModels = require("../models/ItemModels");
var jwt = require("jsonwebtoken");
var _ = require("underscore");
var OrdersModels = require("../../orders/models/orderModels");

function ItemsServices() {
  function CreateItems(data) {
    var deferred = q.defer();
    ItemModels.create(data)
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
        console.error("err", resp);
      });
    return deferred.promise;
  }

  const GetItemsWithZip = async (condition) => {
    var deferred = q.defer();
    // getting all orders for unique Item ID(Product)
    let totolSoldByItem = await OrdersModels.aggregate([
      {
        $group: {
          _id: "$itemId",
          count: { $sum: "$quantity" }, // count:{$sum:"$quantity"}
        },
      },
      { $sort: { _id: 1 } },
    ]);

    let Result = await ItemModels.find(condition);
    const NewResults = [];
    Result.map((item) => {
      totolSoldByItem.map((item2) => {
        //matching Uniquee Item ID with the products

        if (item._id.toString() === item2._id.toString()) {
          Object.assign(item._doc, { totalSold: item2.count });
        }
      });
      NewResults.push(item);
    });
    //Object.assign(item._doc, { sold: "89" });

    var resp = {
      success: true,
      message: "Items Gets Successfully",
      data: NewResults,
    };
    deferred.resolve(resp);

    return deferred.promise;
  };
  function GetItemsById(id) {
    var deferred = q.defer();
    ItemModels.findById(id)
      .then(function (result) {
        var resp = {
          success: true,
          message: "Items Gets Successfully",
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
  function GetItems(condition) {
    var deferred = q.defer();
    ItemModels.find(condition)
      .then(function (result) {
        var resp = {
          success: true,
          message: "Items Gets Successfully",
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
  function uploadAlbums(condition, data) {
    var deferred = q.defer();
    ItemModels.findOneAndUpdate(condition, {
      $push: { albums: { name: data.name, images: data.images } }
    },{new: true, useFindAndModify: false})
      .then(function (result) {
        var resp = {
          success: true,
          message: "Albums Updated Successfully",
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
  function UpdateItems(condition, data) {
    var deferred = q.defer();
    ItemModels.findOneAndUpdate(condition, { $set: data }, {useFindAndModify: false})
      .then(function (result) {
        var resp = {
          success: true,
          message: "Update items Successfully",
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
  function DeleteItems(condition, data) {
    var deferred = q.defer();
    ItemModels.findOneAndUpdate(condition, { $set: data })
      .then(function (result) {
        var resp = {
          success: true,
          message: "Delete items Successfully",
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

  updatetext = (ket) => {
    const temp = this.state.notearray[key];
    this.seState({ notetext: temp });
  };

  function DeleteItems(condition, data) {
    var deferred = q.defer();
    ItemModels.findOneAndUpdate(condition, { $set: data })
      .then(function (result) {
        var resp = {
          success: true,
          message: "Delete items Successfully",
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
    CreateItems: CreateItems,
    GetItems: GetItems,
    UpdateItems: UpdateItems,
    DeleteItems: DeleteItems,
    GetItemsWithZip: GetItemsWithZip,
    uploadAlbums: uploadAlbums,
    GetItemsById: GetItemsById,
    // UpdateUser: UpdateUser
  };
}

module.exports = ItemsServices();
