var QuotationServices = require("../services/quotations");

module.exports = {
  AddQuotation: function (req, res) {
    var data = req.body;
    QuotationServices.AddQuotation(data)
      .then(function (result) {
        return res.json(result);
      })
      .catch(function (error) {
        return res.json(error);
      });
  },

  GetQuotation: function (req, res) {
    let condition = {
      vendorId: req.header("vendorId"),
    };
    QuotationServices.GetQuotations(condition)
      .then(function (result) {
        return res.json(result);
      })
      .catch(function (error) {
        return res.json(error);
      });
  },

  DeleteQuotation: function (req, res) {
    const id = req.body._id;
    QuotationServices.DeleteQuotation(id)
      .then(function (result) {
        return res.json(result);
      })
      .catch(function (error) {
        return res.json(error);
      });
  },
};
