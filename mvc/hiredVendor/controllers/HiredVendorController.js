var HiredVendorServices = require("../services/HiredVendorServices");

module.exports = {
  CreateHiredVendor: async function (req, res) {
    var data = req.body;
    data.userId = req.user._id;
    let condition = {
      is_delete: false,
      userId: req.user._id,
      "product.productId": req.body.product.productId,
    };
    try {
      const result = await HiredVendorServices.GetHiredVendors(condition);
      if (result.data.length) {
        return res.status(400).json({
          success: false,
          message: "Product already exist in Hired Vendor",
        });
      }
    } catch (error) {
      console.error(error, "  - - - error = ");
      return res.status(400).json({
        success: false,
        message: "Something went wrong",
        error,
      });
    }

    HiredVendorServices.CreateHiredVendor(data)
      .then(function (result) {
        return res.status(200).json(result);
      })
      .catch(function (error) {
        return res.status(400).json({
          success: false,
          message: "Something went wrong",
          error,
        });
      });
  },
  TotalGetHiredVendors: function (req, res) {
    let condition = { is_delete: false, userId: req.user._id };

    HiredVendorServices.CountHiredVendors(condition)
      .then(function (result) {
        return res.status(200).json(result);
      })
      .catch(function (error) {
        console.error(error, "  - - - error = ");
        return res.status(400).json({
          success: false,
          message: "Something went wrong",
          error,
        });
      });
  },
  GetHiredVendors: function (req, res) {
    let condition = { is_delete: false, userId: req.user._id };

    HiredVendorServices.GetHiredVendors(condition)
      .then(function (result) {
        return res.status(200).json(result);
      })
      .catch(function (error) {
        console.error(error, "  - - - error = ");
        return res.status(400).json({
          success: false,
          message: "Something went wrong",
          error,
        });
      });
  },
  GetHiredVendor: function (req, res) {
    let condition = {
      is_delete: false,
      _id: req.params.id,
    };

    HiredVendorServices.GetHiredVendors(condition)
      .then(function (result) {
        const totalPrice = result.data.reduce(
          (total, value) => total + parseInt(value.product.totalPrice),
          0
        );
        result.total_HiredVendor_price = totalPrice;
        return res.status(200).json(result);
      })
      .catch(function (error) {
        console.error(error, "  - - - error = ");
        return res.status(400).json({
          success: false,
          message: "Something went wrong",
          error,
        });
      });
  },
  CheckHiredVendor: function (req, res) {
    let condition = {
      is_delete: false,
      userId: req.user._id,
      "product.productId": req.params.id,
    };

    HiredVendorServices.GetHiredVendors(condition)
      .then(function (result) {
        return result.data.length
          ? res.status(200).json({ success: true, data: result.data })
          : res.status(200).json({ success: false });
      })
      .catch(function (error) {
        console.error(error, "  - - - error = ");
        return res.status(400).json({
          success: false,
          message: "Something went wrong",
          error,
        });
      });
  },
  DeleteHiredVendor: function (req, res) {
    HiredVendorServices.DeleteHiredVendor(req.params.id)
      .then(function (result) {
        return res.status(200).json(result);
      })
      .catch(function (error) {
        console.error(error, "  - - - error = ");
        return res.status(400).json({
          success: false,
          message: "Something went wrong",
          error,
        });
      });
  },
};
