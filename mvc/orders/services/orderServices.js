var q = require("q");
var CryptoJS = require("crypto-js");
var config = require("../../../config/config");
var OrderModels = require("../models/orderModels");
var CustomerModels = require("../../customer/models/CustomerModels");
var VariantModels = require("../../shop/model/variantModel");
var jwt = require("jsonwebtoken");
var _ = require("underscore");

function OrdersServices() {
  function CreateOrders(data) {
    var deferred = q.defer();
    OrderModels.create(data)
      .then(function (result) {
        var resp = {
          success: true,
          message: "You have placed an order Successfully",
          data: result,
        };
        deferred.resolve(resp);
      })
      .catch(function (error) {
        console.error(error)

        var resp = {
          success: false,
          message: "Error in processing",
          data: error,
        };
        deferred.reject(resp);
      });
    return deferred.promise;
  }

  function GetUserOrders(condition) {
    var deferred = q.defer();
    OrderModels.find(condition)
      .populate("shopkeeperId")
      // .populate({ path: "itemId", populate: { path: "shopkeeperId" } })
      .then(function (result) {
        var resp = {
          success: true,
          message: "Orders Gets Successfully",
          data: result,
        };
        deferred.resolve(resp);
      })
      .catch(function (error) {
        console.error(error)
        var resp = {
          success: false,
          message: "Error in processing",
          data: error,
        };
        deferred.reject(resp);
      });
    return deferred.promise;
  }
  function GetOrdersPagination(condition, pageNumber,pageSize ) {
    console.log('JK', pageNumber)
    var deferred = q.defer();
  
    // Calculate the skip value to fetch the desired set of documents
    var skipDocuments = (pageNumber - 1) * pageSize;
  
    OrderModels.find(condition)
      .sort({ _id: -1 })  // Sort by _id in descending order for reverse chronological order
      .skip(skipDocuments)
      .limit(pageSize)
      .populate({ path: "userId", model: CustomerModels })
      .populate({ path: "itemId", model: VariantModels })
      .then(function (result) {
        var resp = {
          success: true,
          message: "Orders fetched successfully",
          data: result,
        };
        deferred.resolve(resp);
      })
      .catch(function (error) {
        console.error(error);
        var resp = {
          success: false,
          message: "Error in processing",
          data: error,
        };
        deferred.reject(resp);
      });
  
    return deferred.promise;
  }
  
  
  function GetOrdersCount(condition) {
    var deferred = q.defer();
  
    OrderModels.countDocuments(condition)
      .then(function (count) {
        var resp = {
          success: true,
          message: "Total Order Count Successfully Retrieved",
          count: count,
        };
        deferred.resolve(resp);
      })
      .catch(function (error) {
        console.error(error);
        var resp = {
          success: false,
          message: "Error in processing",
          data: error,
        };
        deferred.reject(resp);
      });
  
    return deferred.promise;
  }
  function GetOrders(condition) {
    var deferred = q.defer();
    OrderModels.find(condition)
    .populate({ path: "userId", model: CustomerModels })
      .populate({ path: "itemId", model:  VariantModels })
      .then(function (result) {
        var resp = {
          success: true,
          message: "Orders Gets Successfully",
          data: result,
        };
        deferred.resolve(resp);
      })
      .catch(function (error) {
        console.error(error)
        var resp = {
          success: false,
          message: "Error in processing",
          data: error,
        };
        deferred.reject(resp);
      });
    return deferred.promise;
  }

  function UpdateOrders(condition, data) {
    var deferred = q.defer();
    OrderModels.findOneAndUpdate(condition, {
      $set: data,
      useFindAndModify: false,
    })
      .then(function (result) {
        var resp = {
          success: true,
          message: "Update Orders Successfully",
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

  function DeleteOrders(condition, data) {
    var deferred = q.defer();
    OrderModels.findOneAndDelete(condition, { $set: data })
      .then(function (result) {
        var resp = {
          success: true,
          message: "Delete Orders Successfully",
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
  
async function createInvoicePDF(data) {
  // const content = [
  //   { text: 'Invoice', fontSize: 20, alignment: 'center', margin: [0, 0, 0, 20] },
  //   { text: 'Bill To:', fontSize: 16, margin: [0, 0, 0, 10] },
  //   { text: `Name: ${data.shippingAddress.name}`, fontSize: 14, margin: [0, 0, 0, 5] },
  //   { text: `Address: ${data.shippingAddress.address1}`, fontSize: 14, margin: [0, 0, 0, 5] },
  //   { text: `Address2: ${data.shippingAddress.address2}`, fontSize: 14, margin: [0, 0, 0, 5] },
  //   { text: `City, State: ${data.shippingAddress.city}, ${data.shippingAddress.state}`, fontSize: 14, margin: [0, 0, 0, 5] },
  //   { text: `Pincode: ${data.shippingAddress.pincode}`, fontSize: 14, margin: [0, 0, 0, 5] },
  //   { text: `Country: ${data.shippingAddress.country}`, fontSize: 14, margin: [0, 0, 0, 5] },
  //   { text: `Phone: ${data.shippingAddress.number}`, fontSize: 14, margin: [0, 0, 0, 20] },
    
  //   // Add more content elements as needed for other invoice details
  // ];
  // return { content };

}

  return {
    CreateOrders: CreateOrders,
    GetOrders: GetOrders,
    UpdateOrders: UpdateOrders,
    DeleteOrders: DeleteOrders,
    GetUserOrders: GetUserOrders,
    createInvoicePDF:createInvoicePDF,
    GetOrdersPagination:GetOrdersPagination,
    GetOrdersCount:GetOrdersCount
  };
}

module.exports = OrdersServices();
