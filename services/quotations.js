var q = require("q");
var QuotationModels = require("../models/quotations");

function QuotationServices() {
  function AddQuotation(data) {
    var deferred = q.defer();
    QuotationModels.create(data)
      .then(function (result) {
        var resp = {
          success: true,
          message: "Quotation Added",
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

  function GetQuotations(condition) {
    var deferred = q.defer();
    QuotationModels.find(condition)
      .then(function (result) {
        var resp = {
          success: true,
          message: "Quotation received successfully",
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

  function DeleteQuotation(id) {
    var deferred = q.defer();
    QuotationModels.findByIdAndDelete(id)
      .then(function (result) {
        var resp = {
          success: true,
          message: "Quotation Deleted",
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

  return {
    AddQuotation: AddQuotation,
    GetQuotations: GetQuotations,
    DeleteQuotation: DeleteQuotation,
  };
}

module.exports = QuotationServices();
