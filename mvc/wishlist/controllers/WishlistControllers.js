var WishlistsServices = require("../services/WishlistServices");
const VariantModel = require("../../shop/model/variantModel");
module.exports = {
  CreateWishlists: async function (req, res) {
    var data = req.body;
    data.userId = req.user._id;
    let condition = {
      is_delete: false,
      userId: req.user._id,
      "product.productId": req.body.product.productId,
    };
    try {
      const result = await WishlistsServices.GetWishlists(condition);
      if (result.data.length) {
        return res.status(400).json({
          success: false,
          message: "Product already exist in Wishlist",
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

    WishlistsServices.CreateWishlists(data)
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

  GetWishlists: async function (req, res) {
    let condition = { is_delete: false, userId: req.user._id };

    WishlistsServices.GetWishlists(condition)
      .then(async function (result) {
        const data = await result.data.map(async (value) => {
          const data = JSON.parse(JSON.stringify(value));
          if (data.product.type === "Product") {
            const variant = await VariantModel.findOne({
              _id: data.product.productId,
            });
            console.log("🚀 ~ data ~ variant:", variant);
            if (!variant?.psizes["Small"]?.qauntity) {
              delete variant?.psizes["Small"];
            }
            if (!variant?.psizes["Medium"]?.qauntity) {
              delete variant?.psizes["Medium"];
            }
            if (!variant?.psizes["Large"]?.qauntity) {
              delete variant?.psizes["Large"];
            }
            if (!variant?.psizes["Extra Large"]?.qauntity) {
              delete variant?.psizes["Extra Large"];
            }
            if (!variant?.psizes["XXL"]?.qauntity) {
              delete variant?.psizes["XXL"];
            }
            if (!variant?.psizes["XXXL"]?.qauntity) {
              delete variant?.psizes["XXXL"];
            }
            data.product.psizes = variant?.psizes;
            return data;
          } else {
            return data;
          }
        });

        result.data = await Promise.all(data);
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
  GetWishlist: function (req, res) {
    let condition = {
      is_delete: false,
      _id: req.params.id,
    };

    WishlistsServices.GetWishlists(condition)
      .then(function (result) {
        const totalPrice = result.data.reduce(
          (total, value) => total + parseInt(value.product.totalPrice),
          0
        );
        result.total_Wishlist_price = totalPrice;
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
  CheckWishlist: function (req, res) {
    let condition = {
      is_delete: false,
      userId: req.user._id,
      "product.productId": req.params.id,
    };

    WishlistsServices.GetWishlists(condition)
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
  DeleteWishlist: function (req, res) {
    WishlistsServices.DeleteWishlist(req.params.id)
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
