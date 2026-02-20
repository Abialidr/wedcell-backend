const variantModel = require("../../shop/model/variantModel");
const CartModel = require("../models/CartModel");
var CartsServices = require("../services/CartServices");

module.exports = {
  CreateCarts: async function (req, res) {
    try {
      var data = req.body;
      data.userId = req.user._id;
      data.totalPrice = req.body.price * req.body.quantity;

      const variantData = await variantModel.findOne({
        _id: data.variantId,
      });

      if (variantData.psizes[data.size].qauntity < data.quantity) {
        return res.status(400).json({
          success: false,
          message: "Invalid quantity",
        });
      }
      let condition = {
        userId: req.user._id,
        variantId: req.body.variantId,
        size: req.body.size,
      };
      const result = await CartsServices.GetCarts(condition);
      if (result.data.length) {
        return res.status(400).json({
          success: false,
          message: "Product already exist in cart",
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

    CartsServices.CreateCarts(data)
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

  UpdateCarts: async function (req, res) {
    var data = req.body;
    try {
      const cart = await CartModel.findOne({
        _id: data._id,
      });

      const variantData = await variantModel.findOne({
        _id: cart.variantId,
      });

      if (variantData.psizes[cart.size].qauntity < data.quantity) {
        return res.status(400).json({
          success: false,
          message: "Invalid quantity",
        });
      }
      data.totalPrice = cart.price * req.body.quantity;
      CartsServices.UpdateCarts(data)
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
    } catch (error) {
      console.error(`🚀 ~ file: CartControllers.js:85 ~ error:`, error);
      return res.status(400).json({
        success: false,
        message: "Something went wrong",
        error,
      });
    }
  },

  GetCarts: function (req, res) {
    let condition = { userId: req.user._id };

    CartsServices.GetCarts(condition)
      .then(async function (result) {
        const totalPrice = result.data.reduce(
          (total, value) => total + parseInt(value.totalPrice),
          0
        );
        result.total_cart_price = totalPrice;
        let variantDatas = await result.data.map(async (data) => {
          const variantData = await variantModel.findOne({
            _id: data.variantId,
          });
          return variantData;
        });

        variantDatas = await Promise.all(variantDatas);
        const newRes = JSON.parse(JSON.stringify(result.data));
        variantDatas.forEach((data, key) => {
          newRes[key].maxQnty = data.psizes[result.data[key].size].qauntity;
          newRes[key].weight = data.psizes[result.data[key].size].weight;
          newRes[key].productId = data.productId;
        });

        result.data = newRes;

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
  GetCart: function (req, res) {
    let condition = {
      _id: req.params.id,
    };

    CartsServices.GetCarts(condition)
      .then(function (result) {
        const totalPrice = result.data.reduce(
          (total, value) => total + parseInt(value.totalPrice),
          0
        );
        result.total_cart_price = totalPrice;
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
  CheckCart: function (req, res) {
    let condition = {
      userId: req.user._id,
      variantId: req.params.id,
      size: req.query.size,
    };
    CartsServices.GetCarts(condition)
      .then(async function (result) {
        if (result.data.length) {
          const variantData = await variantModel.findOne({
            _id: result.data[0].variantId,
          });

          return res.status(200).json({
            success: true,
            data: result?.data[0],
            maxQauntity: variantData?.psizes[result?.data[0].size].qauntity,
            productId: variantData.productId,
          });
        }
        return res.status(200).json({ success: false });
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
  DeleteCart: function (req, res) {
    CartsServices.DeleteCart(req.params.id)
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
