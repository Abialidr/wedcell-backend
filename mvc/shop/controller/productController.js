var WishlistsServices = require("../../wishlist/services/WishlistServices");
var CartsServices = require("../../cart/services/CartServices");

var ProductServices = require("../services/productServices");
var otherProductServices = require("../services/otherProductServices");
var OrderServices = require("../../orders/services/orderServices");
var productModels = require("../model/productModel");
var otherProductModels = require("../model/otherProductModel");
var variantModels = require("../model/variantModel");
const variantModel = require("../model/variantModel");
const userModel = require("../../users/models/UserModels");
const { async } = require("q");
const orderModels = require("../../orders/models/orderModels");
const productModel = require("../model/productModel");
const mongoose = require("mongoose");

const {
  CreateUser,
} = require("../../shop now user/services/ShopNowUserServices");
const SearchListModels = require("../../search list/models/SearchListModels");
const { replaceS3BaseUrl } = require("../../../utils");

module.exports = {
  CreateProducts: async function (req, res) {
    const ProductData = JSON.parse(req.body.ProductData);
    const VariantsData = JSON.parse(req.body.VariantsData);

    VariantsData.forEach((data, key) => {
      VariantsData[key].images = req.files[`album${key}`].map((item) =>
        replaceS3BaseUrl(item.location)
      );
      VariantsData[key].videos = req.files[`video${key}`].map((item) =>
        replaceS3BaseUrl(item.location)
      );
      VariantsData[key].mainImages = replaceS3BaseUrl(
        req.files[`main${key}`][0].location
      );
      VariantsData[key].category = ProductData.category;
      VariantsData[key].vendorId = ProductData.vendorId;
      VariantsData[key].subCategory = ProductData.subCategory;
      VariantsData[key].city = ProductData.city;
      VariantsData[key].productName = ProductData.productName;
      VariantsData[key].manufacturingDetails = ProductData.manufacturingDetails;
      VariantsData[key].occation = ProductData.occation;
    });
    try {
      const product = await productModels.create(ProductData);
      if (product) {
        let variants = await VariantsData.map(async (data) => {
          data.productId = product._id;

          const variant = await variantModel.create(data);
          await SearchListModels.create({
            name: variant.name,
            company_name: variant.name,
            userId: variant._id,
            link: `/products/${product._id}?variantId=${variant._id}`,
          });
          return variant;
        });

        variants = await Promise.all(variants);
        let variantsId = variants.map((data) => {
          return data._id;
        });

        const updateProduct = await productModels.findOneAndUpdate(
          { _id: product._id },
          {
            variants: variantsId,
          }
        );

        res.status(200).send({
          data: {
            product: updateProduct,
            variants,
          },
          success: true,
          message: "data added successfully",
        });
      }
    } catch (error) {
      res.status(400).send({
        error,
        success: false,
        message: "Something went wrong",
      });
    }
  },
  UpdateProducts: async function (req, res) {
    let productData, variantData;
    if (Object.hasOwnProperty.bind(req.body)("popular")) {
      productData = variantData = {
        popular: req.body.popular,
      };
    } else if (Object.hasOwnProperty.bind(req.body)("is_approved")) {
      productData = variantData = {
        is_approved: req.body.is_approved,
      };
    } else if (Object.hasOwnProperty.bind(req.body)("is_delete")) {
      productData = variantData = {
        is_delete: req.body.is_delete,
      };
    } else if (Object.hasOwnProperty.bind(req.body)("exclusive")) {
      productData = variantData = {
        exclusive: req.body.exclusive,
      };
    } else {
      productData = JSON.parse(req.body.ProductData);

      const VariantsData = JSON.parse(req.body.VariantsData);

      VariantsData.forEach((data, key) => {
        if (data._id) {
          const images = req.files[`album${key}`]
            ? req.files[`album${key}`].map((item) =>
                replaceS3BaseUrl(item.location)
              )
            : [];
          const videos = req.files[`video${key}`]
            ? req.files[`video${key}`].map((item) =>
                replaceS3BaseUrl(item.location)
              )
            : [];
          const main = req.files[`main${key}`]
            ? replaceS3BaseUrl(req.files[`main${key}`][0].location)
            : "";
          VariantsData[key].category = productData.category;
          VariantsData[key].subCategory = productData.subCategory;
          VariantsData[key].city = productData.city;
          VariantsData[key].occation = productData.occation;
          VariantsData[key].productName = productData.productName;
          VariantsData[key].manufacturingDetails =
            productData.manufacturingDetails;
          VariantsData[key].images = [
            ...VariantsData[key].images.map((data) => replaceS3BaseUrl(data)),
            ...images,
          ];
          VariantsData[key].videos = [
            ...VariantsData[key].videos.map((data) => replaceS3BaseUrl(data)),
            ...videos,
          ];
          VariantsData[key].mainImages = main
            ? main
            : replaceS3BaseUrl(VariantsData[key].mainImages);
          VariantsData[key].vendorId = productData.vendorId;
        } else {
          VariantsData[key].images = req.files[`album${key}`]
            ? req.files[`album${key}`].map((item) =>
                replaceS3BaseUrl(item.location)
              )
            : [];
          VariantsData[key].videos = req.files[`video${key}`]
            ? req.files[`video${key}`].map((item) =>
                replaceS3BaseUrl(item.location)
              )
            : [];
          VariantsData[key].mainImages = req.files[`main${key}`]
            ? replaceS3BaseUrl(req.files[`main${key}`][0].location)
            : "";
          VariantsData[key].category = productData.category;
          VariantsData[key].subCategory = productData.subCategory;
          VariantsData[key].city = productData.city;
          VariantsData[key].occation = productData.occation;

          VariantsData[key].productName = productData.productName;
          VariantsData[key].manufacturingDetails =
            productData.manufacturingDetails;
          VariantsData[key].vendorId = productData.vendorId;
        }
      });

      variantData = {};
      variantData.newData = VariantsData.filter((data) => !data._id);
      variantData.oldData = VariantsData.filter((data) => data._id);
    }
    try {
      let variantRes;
      const prodRes = await productModels.findOneAndUpdate(
        { _id: req.body._id ? req.body._id : productData._id },
        { $set: productData },
        { useFindAndModify: false, new: true }
      );

      if (
        Object.hasOwnProperty.bind(variantData)("newData") &&
        Object.hasOwnProperty.bind(variantData)("oldData")
      ) {
        let newData, oldData;
        newData = await variantData.newData.map(async (data) => {
          data.productId = productData._id;
          const variant = await variantModel.create(data);
          await SearchListModels.create({
            name: variant.name,
            company_name: variant.name,
            userId: variant._id,
            link: `/products/${product._id}?variantId=${variant._id}`,
          });
          return variant;
        });
        oldData = await variantData.oldData.map(async (data) => {
          await SearchListModels.findOneAndUpdate(
            { userId: data._id },
            {
              name: data.name,
              company_name: data.name,
            }
          );
          return variantModel.findOneAndUpdate(
            { _id: data._id },
            { $set: data },
            { useFindAndModify: false, new: true }
          );
        });
        newData = await Promise.all(newData);
        oldData = await Promise.all(oldData);

        variantRes = newData.concat(oldData);
      } else {
        variantRes = await prodRes.variants.map(async (_id) => {
          return variantModel.findOneAndUpdate(
            { _id },
            { $set: variantData },
            { useFindAndModify: false, new: true }
          );
        });
        variantRes = await Promise.all(variantRes);
      }
      const variantsId = variantRes.map((data) => data._id);

      productData.variants = variantsId;

      res.status(200).send({
        success: true,
        message: "Update Products Successfully",
        data: {
          product: prodRes,
          variants: variantRes,
        },
      });
    } catch (error) {
      res.status(400).send({
        success: false,
        message: "Error in processing",
        data: error,
      });
    }
  },
  UpdateVariants: async function (req, res) {
    try {
      if (req.body.type === "Add") {
        const VariantsData = JSON.parse(req.body.VariantsData);

        const ProductData = await productModels.findById(req.body.productId);
        VariantsData.images = req.files[`album`].map((item) =>
          replaceS3BaseUrl(item.location)
        );
        VariantsData.videos = req.files[`video`].map((item) =>
          replaceS3BaseUrl(item.location)
        );
        VariantsData.mainImages = replaceS3BaseUrl(
          req.files[`main`][0].location
        );
        VariantsData.category = ProductData.category;
        VariantsData.subCategory = ProductData.subCategory;
        VariantsData.city = ProductData.city;
        VariantsData.productName = ProductData.productName;
        VariantsData.manufacturingDetails = ProductData.productName;
        VariantsData.productId = ProductData._id;

        const variant = await variantModel.create(VariantsData);
        ProductData.variants.push(variant._id);
        await productModels.findOneAndUpdate(
          { _id: req.body.productId },
          {
            variants: ProductData.variants,
          },
          { useFindAndModify: false, new: true }
        );

        res.status(200).send({
          data: {
            variant,
          },
          success: true,
          message: "data added successfully",
        });
      } else {
        const variantData = JSON.parse(req.body.VariantsData);
        const images = req.files[`album`]
          ? req.files[`album`].map((item) => replaceS3BaseUrl(item.location))
          : [];
        const videos = req.files[`video`]
          ? req.files[`video`].map((item) => replaceS3BaseUrl(item.location))
          : [];
        const main = req.files[`main`]
          ? replaceS3BaseUrl(req.files[`main`][0].location)
          : "";

        variantData.images = [
          ...variantData.images.map((data) => replaceS3BaseUrl(data)),
          ...images,
        ];
        variantData.videos = [
          ...variantData.videos.map((data) => replaceS3BaseUrl(data)),
          ...videos,
        ];
        variantData.mainImages = main
          ? replaceS3BaseUrl(main)
          : replaceS3BaseUrl(variantData.mainImages);

        let variantRes = await variantModel.findOneAndUpdate(
          { _id: variantData._id },
          { $set: variantData },
          { useFindAndModify: false, new: true }
        );

        res.status(200).send({
          success: true,
          message: "Update Products Successfully",
          data: {
            variants: variantRes,
          },
        });
      }
    } catch (error) {
      console.error(`🚀 ~ file: productController.js:249 ~ error:`, error);
      res.status(400).send({
        success: false,
        message: "Error in processing",
        data: error,
      });
    }
  },
  DeleteProducts: async function (req, res) {
    try {
      let data = {
        is_delete: req.body.is_delete,
      };
      let condition = {
        _id: req.body._id,
      };
      const productData = await productModels.findOneAndDelete(
        condition,

        { useFindAndModify: false }
      );
      let variants = await productData.variants.map((_id) => {
        return variantModels.findOneAndDelete(
          { _id },

          { useFindAndModify: false }
        );
      });
      variants = Promise.all(variants);

      return res.status(200).send({
        message: "Product deleted successfully",
        varints: {
          message: "these variants are deleted successfully",
          variantsIds: variants,
        },
      });
    } catch (error) {
      console.error(`🚀 ~ file: productController.js:249 ~ error:`, error);
      res.status(400).send({
        success: false,
        message: "Error in processing",
        data: error,
      });
    }
  },
  DeleteVariants: async function (req, res) {
    try {
      const variant = await variantModels.findByIdAndDelete(req.params.id);
      const product = await productModels.findOne({
        _id: variant.productId,
      });
      const remaining_variants = product.variants.filter(
        (data) => data !== req.params.id
      );
      res.status(200).send({
        message: "Variants deleted successfully",
        data: variant,
        success: true,
      });
      const updatedProduct = await productModels.findOneAndUpdate(
        {
          _id: product._id,
        },
        {
          $set: {
            variants: remaining_variants,
          },
        },
        { useFindAndModify: false, new: true }
      );
    } catch (error) {
      res.status(400).send({
        message: "Something went wrong",
        error: error,
        success: false,
      });
    }
  },
  //for vendor
  GetProducts: function (req, res) {
    const data = req.body;
    let condition = { is_delete: false, vendorId: data._id };
    ProductServices.GetProducts(condition)
      .then(function (result) {
        return res.json(result);
      })
      .catch(function (error) {
        console.error(error, "  - - - error = ");
        return res.json(error);
      });
  },
  ///------get_OneItem
  GetVariantSingle: async function (req, res) {
    console.error("inside get product", req.body);
    const data = req.body;

    let condition = { _id: data._id };
    try {
      const product = await variantModels.findOne(condition);
      res.status(200).send(product);
      // if (product) {
      //   let variants;
      //   if (Object.hasOwnProperty.bind(req.body)("type")) {
      //     variants = await product.variants.map(async (data) => {
      //       return await variantModels.findOne({
      //         _id: data,
      //       });
      //     });
      //   } else {
      //     variants = await product.variants.map(async (data) => {
      //       return await variantModels.findOne({
      //         _id: data,
      //         $or: [
      //           {
      //             "psizes.Small.qauntity": {
      //               $gt: 0,
      //             },
      //           },
      //           {
      //             "psizes.Medium.qauntity": {
      //               $gt: 0,
      //             },
      //           },
      //           {
      //             "psizes.Large.qauntity": {
      //               $gt: 0,
      //             },
      //           },
      //           {
      //             "psizes.Extra Large.qauntity": {
      //               $gt: 0,
      //             },
      //           },
      //           {
      //             "psizes.XXL.qauntity": {
      //               $gt: 0,
      //             },
      //           },
      //           {
      //             "psizes.XXXL.qauntity": {
      //               $gt: 0,
      //             },
      //           },
      //         ],
      //       });
      //     });
      //   }
      //   variants = await Promise.all(variants);
      //   variants = variants.filter((data) => data !== null);
      //   variants = JSON.parse(JSON.stringify(variants));
      //   variants.forEach((data, key) => {
      //     if (!data.psizes["Small"].qauntity) {
      //       delete variants[key].psizes["Small"];
      //     }
      //     if (!data.psizes["Medium"].qauntity) {
      //       delete variants[key].psizes["Medium"];
      //     }
      //     if (!data.psizes["Large"].qauntity) {
      //       delete variants[key].psizes["Large"];
      //     }
      //     if (!data.psizes["Extra Large"].qauntity) {
      //       delete variants[key].psizes["Extra Large"];
      //     }
      //     if (!data.psizes["XXL"].qauntity) {
      //       delete variants[key].psizes["XXL"];
      //     }
      //     if (!data.psizes["XXXL"].qauntity) {
      //       delete variants[key].psizes["XXXL"];
      //     }
      //   });
      //   return res.json({
      //     success: true,
      //     message: "Products Gets Successfully",
      //     data: {
      //       product,
      //       variants,
      //     },
      //   });
      // }
    } catch (error) {
      console.error(error, "  - - - error = ");
      return res.json(error);
    }
  },
  Get_Product: async function (req, res) {
    const data = req.body;

    let condition = { is_delete: false, _id: data._id };
    try {
      const product = await productModels.findOne(condition);
      if (product) {
        let variants;
        if (Object.hasOwnProperty.bind(req.body)("type")) {
          variants = await product.variants.map(async (data) => {
            return await variantModels.findOne({
              _id: data,
            });
          });
        } else {
          variants = await product.variants.map(async (data) => {
            return await variantModels.findOne({
              _id: data,
              $or: [
                {
                  "psizes.Small.qauntity": {
                    $gt: 0,
                  },
                },
                {
                  "psizes.Medium.qauntity": {
                    $gt: 0,
                  },
                },
                {
                  "psizes.Large.qauntity": {
                    $gt: 0,
                  },
                },
                {
                  "psizes.Extra Large.qauntity": {
                    $gt: 0,
                  },
                },
                {
                  "psizes.XXL.qauntity": {
                    $gt: 0,
                  },
                },
                {
                  "psizes.XXXL.qauntity": {
                    $gt: 0,
                  },
                },
              ],
            });
          });
        }
        variants = await Promise.all(variants);
        variants = variants.filter((data) => data !== null);
        variants = JSON.parse(JSON.stringify(variants));

        if (!Object.hasOwnProperty.bind(req.body)("type")) {
          variants.forEach((data, key) => {
            if (!data.psizes["Small"].qauntity) {
              delete variants[key].psizes["Small"];
            }
            if (!data.psizes["Medium"].qauntity) {
              delete variants[key].psizes["Medium"];
            }
            if (!data.psizes["Large"].qauntity) {
              delete variants[key].psizes["Large"];
            }
            if (!data.psizes["Extra Large"].qauntity) {
              delete variants[key].psizes["Extra Large"];
            }
            if (!data.psizes["XXL"].qauntity) {
              delete variants[key].psizes["XXL"];
            }
            if (!data.psizes["XXXL"].qauntity) {
              delete variants[key].psizes["XXXL"];
            }
          });
        }
        let res1;
        if (data.isUser !== undefined) {
          res1 = await variants.map(async (value) => {
            let value1 = JSON.parse(JSON.stringify(value));
            let wishListCondition = {
              is_delete: false,
              userId: data.isUser,
              "product.productId": value._id,
            };

            const result = await WishlistsServices.GetWishlists(
              wishListCondition
            );
            if (result.data.length) {
              value1.wishlist = true;
              value1.wishlistID = result.data[0]._id;
            } else {
              value1.wishlist = false;
            }
            for (const data of Object.keys(value1.psizes)) {
              let condition = {
                userId: data.isUser,
                variantId: value._id,
                size: data,
              };
              const cart = await CartsServices.GetCarts(condition);

              if (cart.data.length) {
                value1.psizes[data] = {
                  ...value1.psizes[data],
                  cart: true,
                  cartId: cart.data[0]._id,
                };
              } else {
                value1.psizes[data] = { ...value1.psizes[data], cart: false };
              }
            }

            return value1;
          });
        }
        variants =
          data.isUser !== undefined ? await Promise.all(res1) : variants;
        return res.json({
          success: true,
          message: "Products Gets Successfully",
          data: {
            product,
            variants,
          },
        });
      }
    } catch (error) {
      console.error(error, "  - - - error = ");
      return res.json(error);
    }
  },
  Get_Product1: async function (req, res) {
    const data = req.query;
    let condition = { is_delete: false, _id: data._id };
    try {
      const product = await productModels
        .findOne(condition)
        .populate("vendorId");
      if (product) {
        let variants;
        if (Object.hasOwnProperty.bind(req.query)("type")) {
          variants = await product.variants.map(async (data) => {
            return await variantModels.findOne({
              _id: data,
            });
          });
        } else {
          variants = await product.variants.map(async (data) => {
            return await variantModels.findOne({
              _id: data,
              $or: [
                {
                  "psizes.Small.qauntity": {
                    $gt: 0,
                  },
                },
                {
                  "psizes.Medium.qauntity": {
                    $gt: 0,
                  },
                },
                {
                  "psizes.Large.qauntity": {
                    $gt: 0,
                  },
                },
                {
                  "psizes.Extra Large.qauntity": {
                    $gt: 0,
                  },
                },
                {
                  "psizes.XXL.qauntity": {
                    $gt: 0,
                  },
                },
                {
                  "psizes.XXXL.qauntity": {
                    $gt: 0,
                  },
                },
              ],
            });
          });
        }
        variants = await Promise.all(variants);
        variants = variants.filter((data) => data !== null);
        variants = JSON.parse(JSON.stringify(variants));

        if (!Object.hasOwnProperty.bind(req.query)("type")) {
          variants.forEach((data, key) => {
            if (!data.psizes["Small"].qauntity) {
              delete variants[key].psizes["Small"];
            }
            if (!data.psizes["Medium"].qauntity) {
              delete variants[key].psizes["Medium"];
            }
            if (!data.psizes["Large"].qauntity) {
              delete variants[key].psizes["Large"];
            }
            if (!data.psizes["Extra Large"].qauntity) {
              delete variants[key].psizes["Extra Large"];
            }
            if (!data.psizes["XXL"].qauntity) {
              delete variants[key].psizes["XXL"];
            }
            if (!data.psizes["XXXL"].qauntity) {
              delete variants[key].psizes["XXXL"];
            }
          });
        }
        let res1;
        if (data.isUser !== undefined) {
          res1 = await variants.map(async (value) => {
            let value1 = JSON.parse(JSON.stringify(value));
            let wishListCondition = {
              is_delete: false,
              userId: data.isUser,
              "product.productId": value._id,
            };

            const result = await WishlistsServices.GetWishlists(
              wishListCondition
            );
            if (result.data.length) {
              value1.wishlist = true;
              value1.wishlistID = result.data[0]._id;
            } else {
              value1.wishlist = false;
            }
            for (const data of Object.keys(value1.psizes)) {
              let condition = {
                userId: data.isUser,
                variantId: value._id,
                size: data,
              };
              const cart = await CartsServices.GetCarts(condition);

              if (cart.data.length) {
                value1.psizes[data] = {
                  ...value1.psizes[data],
                  cart: true,
                  cartId: cart.data[0]._id,
                };
              } else {
                value1.psizes[data] = { ...value1.psizes[data], cart: false };
              }
            }

            return value1;
          });
        }
        variants =
          data.isUser !== undefined ? await Promise.all(res1) : variants;
        return res.json({
          success: true,
          message: "Products Gets Successfully",
          data: {
            product,
            variants,
          },
        });
      }
    } catch (error) {
      console.error(error, "  - - - error = ");
      return res.json(error);
    }
  },
  GetProductsAll: async (req, res) => {
    const condition = {
      is_delete: false,
      is_approved: true,
      $or: [
        {
          "psizes.Small.qauntity": {
            $gt: 0,
          },
        },
        {
          "psizes.Medium.qauntity": {
            $gt: 0,
          },
        },
        {
          "psizes.Large.qauntity": {
            $gt: 0,
          },
        },
        {
          "psizes.Extra Large.qauntity": {
            $gt: 0,
          },
        },
        {
          "psizes.XXL.qauntity": {
            $gt: 0,
          },
        },
        {
          "psizes.XXXL.qauntity": {
            $gt: 0,
          },
        },
      ],
    };

    const {
      vendorId,
      category,
      subCategory,
      city,
      productPrice,
      color,
      occation,
      isUser,
      size,
    } = req.body;

    // if (vendorId && vendorId.length) {
    //   condition.vendorId = vendorId;
    // }

    if (category && category.length) {
      // condition.$and.push({ category });
      condition.category = category;
    }
    if (color && color.length) {
      // condition.$and.push({ category });
      condition.color = color;
    }
    if (occation && occation.length) {
      // condition.$and.push({ category });
      condition.occation = occation;
    }
    if (subCategory && subCategory.length) {
      // condition.$and.push({ subCategory });
      condition.subCategory = subCategory;
    }

    if (city && city.length) {
      condition.city = city;
      // condition.$and.push({ city });
    }
    // };
    if (productPrice) {
      condition.$or = [
        {
          "psizes.Small.priceExclusive": {
            $lte: productPrice,
          },
        },
        {
          "psizes.Medium.priceExclusive": {
            $lte: productPrice,
          },
        },
        {
          "psizes.Large.priceExclusive": {
            $lte: productPrice,
          },
        },
        {
          "psizes.Extra Large.priceExclusive": {
            $lte: productPrice,
          },
        },
        {
          "psizes.XXL.priceExclusive": {
            $lte: productPrice,
          },
        },
        {
          "psizes.XXXL.priceExclusive": {
            $lte: productPrice,
          },
        },
      ];
    }
    if (size) {
      condition[`psizes.${size}.qauntity`] = {
        $gt: 0,
      };
    }
    const page = req.body.page ? req.body.page : 1;

    try {
      const result1 = await variantModel
        .find(condition)
        .skip((page - 1) * 40)
        .limit(40);
      const total = await variantModel.countDocuments(condition);
      let result = JSON.parse(JSON.stringify(result1));
      result.forEach((data, key) => {
        if (!data.psizes["Small"].qauntity) {
          delete result[key].psizes["Small"];
        }
        if (!data.psizes["Medium"].qauntity) {
          delete result[key].psizes["Medium"];
        }
        if (!data.psizes["Large"].qauntity) {
          delete result[key].psizes["Large"];
        }
        if (!data.psizes["Extra Large"].qauntity) {
          delete result[key].psizes["Extra Large"];
        }
        if (!data.psizes["XXL"].qauntity) {
          delete result[key].psizes["XXL"];
        }
        if (!data.psizes["XXXL"].qauntity) {
          delete result[key].psizes["XXXL"];
        }
      });

      let res1;
      if (isUser !== undefined) {
        res1 = await result.map(async (value) => {
          let value1 = JSON.parse(JSON.stringify(value));
          let wishListCondition = {
            is_delete: false,
            userId: isUser,
            "product.productId": value._id,
          };

          const result = await WishlistsServices.GetWishlists(
            wishListCondition
          );
          if (result.data.length) {
            value1.wishlist = true;
            value1.wishlistID = result.data[0]._id;
          } else {
            value1.wishlist = false;
          }
          for (const data of Object.keys(value1.psizes)) {
            let condition = {
              userId: isUser,
              variantId: value._id,
              size: data,
            };
            const cart = await CartsServices.GetCarts(condition);

            if (cart.data.length) {
              value1.psizes[data] = {
                ...value1.psizes[data],
                cart: true,
                cartId: cart.data[0]._id,
              };
            } else {
              value1.psizes[data] = { ...value1.psizes[data], cart: false };
            }
          }

          return value1;
        });
      }
      res1 = isUser !== undefined ? await Promise.all(res1) : res1;

      res.status(200).send({
        success: true,
        message: "Products Gets Successfully",
        total,
        totalPage: Math.ceil(total / 40),
        page: page,
        pageSize: result.length,
        data: res1 ? res1 : result,
      });
    } catch (error) {
      res.status(200).send({
        success: false,
        message: "Error in processing",
        data: error,
      });
    }
  },
  GetProductsAll1: async (req, res) => {
    const condition = {
      is_delete: false,
      is_approved: true,
      $or: [
        {
          "psizes.Small.qauntity": {
            $gt: 0,
          },
        },
        {
          "psizes.Medium.qauntity": {
            $gt: 0,
          },
        },
        {
          "psizes.Large.qauntity": {
            $gt: 0,
          },
        },
        {
          "psizes.Extra Large.qauntity": {
            $gt: 0,
          },
        },
        {
          "psizes.XXL.qauntity": {
            $gt: 0,
          },
        },
        {
          "psizes.XXXL.qauntity": {
            $gt: 0,
          },
        },
      ],
    };

    const {
      vendorId,
      category,
      subCategory,
      city,
      productPrice,
      color,
      occation,
      isUser,
      size,
      popular,
    } = req.query;

    // if (vendorId && vendorId.length) {
    //   condition.vendorId = vendorId;
    // }

    if (category && category.length) {
      // condition.$and.push({ category });
      condition.category = category;
    }
    if (color && color.length) {
      // condition.$and.push({ category });
      condition.color = color;
    }
    if (occation && occation.length) {
      // condition.$and.push({ category });
      condition.occation = occation;
    }
    if (subCategory && subCategory.length) {
      // condition.$and.push({ subCategory });
      condition.subCategory = subCategory;
    }

    if (city && city.length) {
      condition.city = city;
      // condition.$and.push({ city });
    }
    if (popular) {
      condition.popular = popular;
      // condition.$and.push({ city });
    }
    // };
    if (productPrice) {
      condition.$or = [
        {
          "psizes.Small.priceExclusive": {
            $lte: productPrice,
          },
        },
        {
          "psizes.Medium.priceExclusive": {
            $lte: productPrice,
          },
        },
        {
          "psizes.Large.priceExclusive": {
            $lte: productPrice,
          },
        },
        {
          "psizes.Extra Large.priceExclusive": {
            $lte: productPrice,
          },
        },
        {
          "psizes.XXL.priceExclusive": {
            $lte: productPrice,
          },
        },
        {
          "psizes.XXXL.priceExclusive": {
            $lte: productPrice,
          },
        },
      ];
    }
    if (size) {
      condition[`psizes.${size}.qauntity`] = {
        $gt: 0,
      };
    }
    const page = req.query.page ? req.query.page : 1;

    try {
      const result1 = await variantModel
        .find(condition)
        .skip((page - 1) * 40)
        .limit(40);
      const total = await variantModel.countDocuments(condition);
      let result = JSON.parse(JSON.stringify(result1));
      result.forEach((data, key) => {
        if (!data.psizes["Small"].qauntity) {
          delete result[key].psizes["Small"];
        }
        if (!data.psizes["Medium"].qauntity) {
          delete result[key].psizes["Medium"];
        }
        if (!data.psizes["Large"].qauntity) {
          delete result[key].psizes["Large"];
        }
        if (!data.psizes["Extra Large"].qauntity) {
          delete result[key].psizes["Extra Large"];
        }
        if (!data.psizes["XXL"].qauntity) {
          delete result[key].psizes["XXL"];
        }
        if (!data.psizes["XXXL"].qauntity) {
          delete result[key].psizes["XXXL"];
        }
      });

      let res1;
      if (isUser !== undefined) {
        res1 = await result.map(async (value) => {
          let value1 = JSON.parse(JSON.stringify(value));
          let wishListCondition = {
            is_delete: false,
            userId: isUser,
            "product.productId": value._id,
          };

          const result = await WishlistsServices.GetWishlists(
            wishListCondition
          );
          if (result.data.length) {
            value1.wishlist = true;
            value1.wishlistID = result.data[0]._id;
          } else {
            value1.wishlist = false;
          }
          for (const data of Object.keys(value1.psizes)) {
            let condition = {
              userId: isUser,
              variantId: value._id,
              size: data,
            };
            const cart = await CartsServices.GetCarts(condition);

            if (cart.data.length) {
              value1.psizes[data] = {
                ...value1.psizes[data],
                cart: true,
                cartId: cart.data[0]._id,
              };
            } else {
              value1.psizes[data] = { ...value1.psizes[data], cart: false };
            }
          }

          return value1;
        });
      }
      res1 = isUser !== undefined ? await Promise.all(res1) : res1;

      res.status(200).send({
        success: true,
        message: "Products Gets Successfully",
        total,
        totalPage: Math.ceil(total / 40),
        page: page,
        pageSize: result.length,
        data: res1 ? res1 : result,
      });
    } catch (error) {
      res.status(200).send({
        success: false,
        message: "Error in processing",
        data: error,
      });
    }
  },
  GetProductsForAdmin: async (req, res) => {
    const condition = {};
    if (Object.hasOwnProperty.bind(req.body)("page")) {
      try {
        const result = await productModels
          .find(condition)
          .skip((req.body.page - 1) * 20)
          .limit(20)
          .sort({ is_approved: 0 });
        const total = await productModels.countDocuments(condition);
        res.status(200).send({
          success: true,
          message: "Products Gets Successfully",
          total,
          totalPage: Math.ceil(total / 20),
          page: req.body.page,
          pageSize: result.length,
          data: result,
        });
      } catch (error) {
        res.status(200).send({
          success: false,
          message: "Error in processing",
          data: error,
        });
      }
    } else {
      ProductServices.GetProducts(condition)
        .then(function (result) {
          return res.json(result);
        })
        .catch(function (error) {
          console.error(error, "  - - - error = ");
          return res.json(error);
        });
    }
  },
  GetTopSellers: async (req, res) => {
    try {
      const shopkeeperId = mongoose.Types.ObjectId(req.body._id);
      // const allProductsCount = await ProductServices.GetProducts({vendorId: shopkeeperId});
      const result = await orderModels.aggregate([
        {
          $match: {
            shopkeeperId: shopkeeperId,
            orderStatus: { $in: ["Processing", "Completed"] },
          },
        },
        {
          $group: {
            _id: "$productId",
            totalQuantity: { $sum: "$quantity" },
            totalAmount: { $sum: { $multiply: ["$quantity", "$amount"] } }, // Calculate the total amount
          },
        },
        {
          $sort: { totalQuantity: -1 },
        },
        {
          $project: {
            productId: "$_id",
            totalQuantity: 1,
            totalAmount: 1,
            _id: 0,
          },
        },
      ]);

      const finalResult = [];
      console.log(result);
      for (const item of result) {
        const product = await productModels.findById(item.productId);
        finalResult.push({
          ...item,
          productName: product.productName,
        });
      }

      res.status(200).send({
        success: true,
        message: "Products Get Successfully",
        data: finalResult,
        // allProductsCount:allProductsCount.data.length
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        success: false,
        message: "An error occurred",
        error: error.message,
      });
    }
  },
  GetTopOrdersByCity: async (req, res) => {
    try {
      console.log(req.body);
      const shopkeeperId = mongoose.Types.ObjectId(req.body._id);

      const result = await orderModels.aggregate([
        {
          $match: {
            shopkeeperId: shopkeeperId,
            orderStatus: { $in: ["Processing", "Completed"] },
          },
        },
        {
          $group: {
            _id: {
              $toLower: "$shippingAddress.city",
            },

            count: { $sum: 1 },
            totalQuantity: { $sum: "$quantity" },
            totalAmount: { $sum: "$amount" },
          },
        },
        {
          $project: {
            city: "$_id",
            count: 1,
            totalQuantity: 1,
            totalAmount: 1,
            _id: 1,
          },
        },
        {
          $sort: { totalQuantity: -1 },
        },
      ]);
      // const finalResult = [];
      console.log(result);
      // for (const item of result) {
      //   const product = await productModels.findById(item.productId);
      //   finalResult.push({
      //     ...item,
      //     productName: product.productName,
      //   });
      // }

      res.status(200).send({
        success: true,
        message: "Orders Get Successfully",
        data: result,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        success: false,
        message: "An error occurred",
        error: error.message,
      });
    }
  },
  GetOrdersByMonth: async (req, res) => {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    try {
      const shopkeeperId = mongoose.Types.ObjectId(req.body._id);

      const result = await orderModels.aggregate([
        {
          $match: {
            shopkeeperId: shopkeeperId,
            orderStatus: { $in: ["Processing", "Completed"] },
            createdAt: {
              $gte: new Date(today.getFullYear(), today.getMonth(), 1), // Start of current month
              $lte: today,
            },
          },
        },
        {
          $group: {
            _id: { $month: "$createdAt" }, // Group by month of createdAt
            totalOrderCount: { $sum: 1 },
            totalAmount: { $sum: "$amount" },
          },
        },
        {
          $project: {
            month: "$_id", // Rename _id to month
            totalOrderCount: 1,
            totalAmount: 1,
            _id: 0,
          },
        },
      ]);

      const todayResult = await orderModels.aggregate([
        {
          $match: {
            shopkeeperId: shopkeeperId,
            orderStatus: { $in: ["Processing", "Completed"] },
            createdAt: {
              $gte: new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate()
              ),
            },
          },
        },
        {
          $group: {
            _id: null,
            totalOrderCount: { $sum: 1 },
            totalAmount: { $sum: "$amount" },
          },
        },
        {
          $project: {
            _id: 0,
            totalOrderCount: 1,
            totalAmount: 1,
          },
        },
      ]);

      const last7DaysResult = await orderModels.aggregate([
        {
          $match: {
            shopkeeperId: shopkeeperId,
            orderStatus: { $in: ["Processing", "Completed"] },
            createdAt: { $gte: sevenDaysAgo, $lte: today },
          },
        },
        {
          $group: {
            _id: null,
            totalOrderCount: { $sum: 1 },
            totalAmount: { $sum: "$amount" },
          },
        },
        {
          $project: {
            _id: 0,
            totalOrderCount: 1,
            totalAmount: 1,
          },
        },
      ]);
      const allTimeResult = await orderModels.aggregate([
        {
          $match: {
            shopkeeperId: shopkeeperId,
            orderStatus: { $in: ["Processing", "Completed"] },
          },
        },
        {
          $group: {
            _id: null,
            totalOrderCount: { $sum: 1 },
            totalAmount: { $sum: "$amount" },
          },
        },
        {
          $project: {
            _id: 0,
            totalOrderCount: 1,
            totalAmount: 1,
          },
        },
      ]);
      const twelveMonthsResult = await orderModels.aggregate([
        {
          $match: {
            shopkeeperId: shopkeeperId,
            orderStatus: { $in: ["Processing", "Completed"] },
            createdAt: {
              $gte: new Date(
                today.getFullYear() - 1,
                today.getMonth(),
                today.getDate()
              ),
              $lte: today,
            },
          },
        },
        {
          $group: {
            _id: { $month: "$createdAt" },
            totalOrderCount: { $sum: 1 },
            totalAmount: { $sum: "$amount" },
          },
        },
        {
          $project: {
            month: "$_id",
            totalOrderCount: 1,
            totalAmount: 1,
            _id: 0,
          },
        },
        {
          $sort: { month: 1 },
        },
      ]);

      res.status(200).send({
        success: true,
        message: "Order Statistics Get Successfully",
        monthlyData: result[0],
        todayData: todayResult[0],
        last7DaysData: last7DaysResult[0],
        allTimeData: allTimeResult[0],
        twelveMonthsData: twelveMonthsResult,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        success: false,
        message: "An error occurred",
        error: error.message,
      });
    }
  },
  fullTextSearch: async (req, res) => {
    try {
      const searchString = req.params.id;

      if (searchString) {
        let condition;
        if (req.query.isAdmin !== undefined) {
          condition = {};
        } else {
          condition = { is_delete: false, is_approved: true };
        }
        req.query.category ? (condition.category = req.query.category) : null;
        req.query.subCategory
          ? (condition.subCategory = req.query.subCategory)
          : null;
        req.query.productPrice
          ? (condition.$or = [
              {
                "psizes.Small.priceExclusive": {
                  $lte: productPrice,
                },
              },
              {
                "psizes.Medium.priceExclusive": {
                  $lte: productPrice,
                },
              },
              {
                "psizes.Large.priceExclusive": {
                  $lte: productPrice,
                },
              },
              {
                "psizes.Extra Large.priceExclusive": {
                  $lte: productPrice,
                },
              },
              {
                "psizes.XXL.priceExclusive": {
                  $lte: productPrice,
                },
              },
              {
                "psizes.XXXL.priceExclusive": {
                  $lte: productPrice,
                },
              },
            ])
          : null;

        req.query.size
          ? (condition[`psizes.${req.query.size}.qauntity`] = {
              $gt: 0,
            })
          : null;
        if (req.query.color && req.query.color.length) {
          // condition.$and.push({ category });
          condition.color = req.query.color;
        }
        if (req.query.occation && req.query.occation.length) {
          // condition.$and.push({ category });
          condition.occation = req.query.occation;
        }
        if (Object.hasOwnProperty.bind(req.query)("page")) {
          try {
            let result;
            let total;
            let devide = req.query.isAdmin !== undefined ? 20 : 40;
            if (req.query.isAdmin !== undefined) {
              result = await productModel
                .find(
                  {
                    $text: { $search: searchString },
                    ...condition,
                  },
                  { score: { $meta: "textScore" } }
                )
                .sort({ score: { $meta: "textScore" } })
                .skip((parseInt(req.query.page) - 1) * 20)
                .limit(20);
              total = await productModels.countDocuments({
                $text: { $search: searchString },
                ...condition,
              });
            } else {
              const result1 = await variantModel
                .find(
                  {
                    $text: { $search: searchString },
                    ...condition,
                  },
                  { score: { $meta: "textScore" } }
                )
                .sort({ score: { $meta: "textScore" } })
                .skip((parseInt(req.query.page) - 1) * 40)
                .limit(40);
              result = JSON.parse(JSON.stringify(result1));
              result.forEach((data, key) => {
                if (!data.psizes["Small"].qauntity) {
                  delete result[key].psizes["Small"];
                }
                if (!data.psizes["Medium"].qauntity) {
                  delete result[key].psizes["Medium"];
                }
                if (!data.psizes["Large"].qauntity) {
                  delete result[key].psizes["Large"];
                }
                if (!data.psizes["Extra Large"].qauntity) {
                  delete result[key].psizes["Extra Large"];
                }
                if (!data.psizes["XXL"].qauntity) {
                  delete result[key].psizes["XXL"];
                }
                if (!data.psizes["XXXL"].qauntity) {
                  delete result[key].psizes["XXXL"];
                }
              });
              total = await variantModel.countDocuments({
                $text: { $search: searchString },
                ...condition,
              });
            }

            res.status(200).send({
              success: true,
              message: "Items Gets Successfully",
              total,
              totalPage: Math.ceil(total / devide),
              page: req.query.page,
              pageSize: result.length,
              data: result,
            });
          } catch (error) {
            res.status(200).send({
              success: false,
              message: "Error in processing",
              data: error,
            });
          }
        } else {
          const data = await productModels
            .find(
              {
                $text: { $search: searchString },
                ...condition,
              },
              { score: { $meta: "textScore" } }
            )
            .sort({ score: { $meta: "textScore" } })
            .limit(10);

          res.status(200).send({
            success: true,
            data,
          });
        }
      } else {
        res.status(400).send({
          success: false,
        });
      }
    } catch (error) {
      res.status(400).send({
        success: false,
      });
    }
  },

  Get_All_Other_Product_Client: async (req, res) => {
    const condition = {
      is_delete: false,
      // is_approved: true,
    };

    const { category, isUser, productPrice, popular } = req.query;
    console.log(
      "🚀 ~ file: productController.js:1691 ~ Get_All_Other_Product_Client: ~ productPrice:",
      productPrice
    );

    // if (vendorId && vendorId.length) {
    //   condition.vendorId = vendorId;
    // }

    if (category && category.length) {
      // condition.$and.push({ category });
      condition.category = category;
    }
    if (popular) {
      // condition.$and.push({ category });
      condition.popular = popular;
    }
    if (productPrice && productPrice.length) {
      // condition.$and.push({ category });
      condition.price = {
        $lte: parseInt(productPrice),
      };
    }
    const page = req.query.page ? req.query.page : 1;
    try {
      const result1 = await otherProductModels
        .find(condition)
        .skip((page - 1) * 40)
        .limit(40);
      const total = await otherProductModels.countDocuments(condition);
      let result = JSON.parse(JSON.stringify(result1));
      let res1;
      if (isUser !== undefined) {
        res1 = await result.map(async (value) => {
          let value1 = JSON.parse(JSON.stringify(value));
          let wishListCondition = {
            is_delete: false,
            userId: isUser,
            "product.productId": value._id,
          };

          const result = await WishlistsServices.GetWishlists(
            wishListCondition
          );
          if (result.data.length) {
            value1.wishlist = true;
            value1.wishlistID = result.data[0]._id;
          } else {
            value1.wishlist = false;
          }
          return value1;
        });
      }
      res1 = isUser !== undefined ? await Promise.all(res1) : res1;

      res.status(200).send({
        success: true,
        message: "Products Gets Successfully",
        total,
        totalPage: Math.ceil(total / 40),
        page: page,
        pageSize: result.length,
        data: res1 ? res1 : result,
      });
    } catch (error) {
      res.status(200).send({
        success: false,
        message: "Error in processing",
        data: error,
      });
    }
  },
  full_Text_Search_Other_Product: async (req, res) => {
    try {
      const searchString = req.params.id;

      if (searchString) {
        let condition;
        if (req.query.isAdmin !== undefined) {
          condition = {};
        } else {
          condition = {
            is_delete: false,
            // is_approved: true
          };
        }
        req.query.category ? (condition.category = req.query.category) : null;
        if (req.query.productPrice && req.query.productPrice.length) {
          // condition.$and.push({ category });
          condition.productPrice = {
            $lte: req.query.productPrice,
          };
        }
        if (Object.hasOwnProperty.bind(req.query)("page")) {
          try {
            let result;
            let total;
            let devide = req.query.isAdmin !== undefined ? 20 : 15;
            const result1 = await otherProductModels
              .find(
                {
                  $text: { $search: searchString },
                  ...condition,
                },
                { score: { $meta: "textScore" } }
              )
              .sort({ score: { $meta: "textScore" } })
              .skip((parseInt(req.query.page) - 1) * devide)
              .limit(devide);
            result = JSON.parse(JSON.stringify(result1));
            total = await otherProductModels.countDocuments({
              $text: { $search: searchString },
              ...condition,
            });
            res.status(200).send({
              success: true,
              message: "Items Gets Successfully",
              total,
              totalPage: Math.ceil(total / devide),
              page: req.query.page,
              pageSize: result.length,
              data: result,
            });
          } catch (error) {
            res.status(200).send({
              success: false,
              message: "Error in processing",
              data: error,
            });
          }
        } else {
          const data = await otherProductModels
            .find(
              {
                $text: { $search: searchString },
                ...condition,
              },
              { score: { $meta: "textScore" } }
            )
            .sort({ score: { $meta: "textScore" } })
            .limit(10);

          res.status(200).send({
            success: true,
            data,
          });
        }
      } else {
        res.status(400).send({
          success: false,
        });
      }
    } catch (error) {
      res.status(400).send({
        success: false,
      });
    }
  },
  CreateOtherProducts: async function (req, res) {
    const ProductData = JSON.parse(req.body.ProductData);
    ProductData.images = req.files[`album`].map((item) =>
      replaceS3BaseUrl(item.location)
    );
    ProductData.videos = req.files[`video`].map((item) =>
      replaceS3BaseUrl(item.location)
    );
    ProductData.mainImages = replaceS3BaseUrl(req.files[`main`][0].location);

    try {
      const product = await otherProductModels.create(ProductData);
      res.status(200).send({
        data: {
          product,
        },
        success: true,
        message: "data added successfully",
      });
    } catch (error) {
      res.status(400).send({
        error,
        success: false,
        message: "Something went wrong",
      });
    }
  },
  Get_Single_Other_Product: async function (req, res) {
    const data = req.body;
    let condition = { is_delete: false, _id: data._id };
    try {
      const product = await otherProductModels.findOne(condition);
      if (product) {
        // let variants;
        // if (Object.hasOwnProperty.bind(req.query)("type")) {
        //   variants = await product.variants.map(async (data) => {
        //     return await variantModels.findOne({
        //       _id: data,
        //     });
        //   });
        // } else {
        //   variants = await product.variants.map(async (data) => {
        //     return await variantModels.findOne({
        //       _id: data,
        //       $or: [
        //         {
        //           "psizes.Small.qauntity": {
        //             $gt: 0,
        //           },
        //         },
        //         {
        //           "psizes.Medium.qauntity": {
        //             $gt: 0,
        //           },
        //         },
        //         {
        //           "psizes.Large.qauntity": {
        //             $gt: 0,
        //           },
        //         },
        //         {
        //           "psizes.Extra Large.qauntity": {
        //             $gt: 0,
        //           },
        //         },
        //         {
        //           "psizes.XXL.qauntity": {
        //             $gt: 0,
        //           },
        //         },
        //         {
        //           "psizes.XXXL.qauntity": {
        //             $gt: 0,
        //           },
        //         },
        //       ],
        //     });
        //   });
        // }
        // variants = await Promise.all(variants);
        // variants = variants.filter((data) => data !== null);
        // variants = JSON.parse(JSON.stringify(variants));

        // if (!Object.hasOwnProperty.bind(req.query)("type")) {
        //   variants.forEach((data, key) => {
        //     if (!data.psizes["Small"].qauntity) {
        //       delete variants[key].psizes["Small"];
        //     }
        //     if (!data.psizes["Medium"].qauntity) {
        //       delete variants[key].psizes["Medium"];
        //     }
        //     if (!data.psizes["Large"].qauntity) {
        //       delete variants[key].psizes["Large"];
        //     }
        //     if (!data.psizes["Extra Large"].qauntity) {
        //       delete variants[key].psizes["Extra Large"];
        //     }
        //     if (!data.psizes["XXL"].qauntity) {
        //       delete variants[key].psizes["XXL"];
        //     }
        //     if (!data.psizes["XXXL"].qauntity) {
        //       delete variants[key].psizes["XXXL"];
        //     }
        //   });
        // }
        // let res1;
        // if (data.isUser !== undefined) {
        //   res1 = await variants.map(async (value) => {
        //     let value1 = JSON.parse(JSON.stringify(value));
        //     let wishListCondition = {
        //       is_delete: false,
        //       userId: data.isUser,
        //       "product.productId": value._id,
        //     };

        //     const result = await WishlistsServices.GetWishlists(
        //       wishListCondition
        //     );
        //     if (result.data.length) {
        //       value1.wishlist = true;
        //       value1.wishlistID = result.data[0]._id;
        //     } else {
        //       value1.wishlist = false;
        //     }
        //     for (const data of Object.keys(value1.psizes)) {
        //       let condition = {
        //         userId: data.isUser,
        //         variantId: value._id,
        //         size: data,
        //       };
        //       const cart = await CartsServices.GetCarts(condition);

        //       if (cart.data.length) {
        //         value1.psizes[data] = {
        //           ...value1.psizes[data],
        //           cart: true,
        //           cartId: cart.data[0]._id,
        //         };
        //       } else {
        //         value1.psizes[data] = { ...value1.psizes[data], cart: false };
        //       }
        //     }

        //     return value1;
        //   });
        // }
        // variants =
        //   data.isUser !== undefined ? await Promise.all(res1) : variants;
        return res.json({
          success: true,
          message: "Products Gets Successfully",
          data: {
            product,
          },
        });
      }
    } catch (error) {
      console.error(error, "  - - - error = ");
      return res.json(error);
    }
  },
  GetOtherProductsForAdmin: async (req, res) => {
    const condition = {};
    if (Object.hasOwnProperty.bind(req.body)("page")) {
      try {
        const result = await otherProductModels
          .find(condition)
          .skip((req.body.page - 1) * 20)
          .limit(20)
          .sort({ is_approved: 0 });
        const total = await otherProductModels.countDocuments(condition);
        res.status(200).send({
          success: true,
          message: "Products Gets Successfully",
          total,
          totalPage: Math.ceil(total / 20),
          page: req.body.page,
          pageSize: result.length,
          data: result,
        });
      } catch (error) {
        res.status(200).send({
          success: false,
          message: "Error in processing",
          data: error,
        });
      }
    } else {
      ProductServices.GetProducts(condition)
        .then(function (result) {
          return res.json(result);
        })
        .catch(function (error) {
          console.error(error, "  - - - error = ");
          return res.json(error);
        });
    }
  },
  Get_Single_Other_Product_Client: async function (req, res) {
    const data = req.query;
    let condition = { is_delete: false, _id: data._id };
    try {
      const product = await otherProductModels.findOne(condition);
      if (product) {
        return res.json({
          success: true,
          message: "Products Gets Successfully",
          data: {
            product,
          },
        });
      }
    } catch (error) {
      console.error(error, "  - - - error = ");
      return res.json(error);
    }
  },
  Get_All_Other_Product: async (req, res) => {
    const condition = {
      is_delete: false,
      // is_approved: true,
    };

    const { vendorId, category, isUser } = req.query;

    if (vendorId && vendorId.length) {
      condition.vendorId = vendorId;
    }

    if (category && category.length) {
      // condition.$and.push({ category });
      condition.category = category;
    }

    // };

    const page = req.query.page ? req.query.page : 1;

    try {
      const result1 = await variantModel
        .find(condition)
        .skip((page - 1) * 40)
        .limit(40);
      const total = await variantModel.countDocuments(condition);
      let result = JSON.parse(JSON.stringify(result1));
      result.forEach((data, key) => {
        if (!data.psizes["Small"].qauntity) {
          delete result[key].psizes["Small"];
        }
        if (!data.psizes["Medium"].qauntity) {
          delete result[key].psizes["Medium"];
        }
        if (!data.psizes["Large"].qauntity) {
          delete result[key].psizes["Large"];
        }
        if (!data.psizes["Extra Large"].qauntity) {
          delete result[key].psizes["Extra Large"];
        }
        if (!data.psizes["XXL"].qauntity) {
          delete result[key].psizes["XXL"];
        }
        if (!data.psizes["XXXL"].qauntity) {
          delete result[key].psizes["XXXL"];
        }
      });

      let res1;
      if (isUser !== undefined) {
        res1 = await result.map(async (value) => {
          let value1 = JSON.parse(JSON.stringify(value));
          let wishListCondition = {
            is_delete: false,
            userId: isUser,
            "product.productId": value._id,
          };

          const result = await WishlistsServices.GetWishlists(
            wishListCondition
          );
          if (result.data.length) {
            value1.wishlist = true;
            value1.wishlistID = result.data[0]._id;
          } else {
            value1.wishlist = false;
          }
          for (const data of Object.keys(value1.psizes)) {
            let condition = {
              userId: isUser,
              variantId: value._id,
              size: data,
            };
            const cart = await CartsServices.GetCarts(condition);

            if (cart.data.length) {
              value1.psizes[data] = {
                ...value1.psizes[data],
                cart: true,
                cartId: cart.data[0]._id,
              };
            } else {
              value1.psizes[data] = { ...value1.psizes[data], cart: false };
            }
          }

          return value1;
        });
      }
      res1 = isUser !== undefined ? await Promise.all(res1) : res1;

      res.status(200).send({
        success: true,
        message: "Products Gets Successfully",
        total,
        totalPage: Math.ceil(total / 40),
        page: page,
        pageSize: result.length,
        data: res1 ? res1 : result,
      });
    } catch (error) {
      res.status(200).send({
        success: false,
        message: "Error in processing",
        data: error,
      });
    }
  },
  Get_Other_Products: function (req, res) {
    const data = req.body;
    let condition = { is_delete: false, vendorId: data._id };
    otherProductServices
      .GetProducts(condition)
      .then(function (result) {
        return res.json(result);
      })
      .catch(function (error) {
        console.error(error, "  - - - error = ");
        return res.json(error);
      });
  },
  UpdateOtherProducts: async function (req, res) {
    let productData, variantData;
    try {
      if (Object.hasOwnProperty.bind(req.body)("popular")) {
        productData = variantData = {
          popular: req.body.popular,
          _id: req.body._id,
        };
      } else if (Object.hasOwnProperty.bind(req.body)("is_approved")) {
        productData = variantData = {
          is_approved: req.body.is_approved,
          _id: req.body._id,
        };
      } else if (Object.hasOwnProperty.bind(req.body)("is_delete")) {
        productData = variantData = {
          is_delete: req.body.is_delete,
          _id: req.body._id,
        };
      } else if (Object.hasOwnProperty.bind(req.body)("exclusive")) {
        productData = variantData = {
          exclusive: req.body.exclusive,
          _id: req.body._id,
        };
      } else {
        variantData = JSON.parse(req.body.ProductData);
        const images = req.files[`album`]
          ? req.files[`album`].map((item) => replaceS3BaseUrl(item.location))
          : [];
        const videos = req.files[`video`]
          ? req.files[`video`].map((item) => replaceS3BaseUrl(item.location))
          : [];
        const main = req.files[`main`]
          ? replaceS3BaseUrl(req.files[`main`][0].location)
          : "";

        variantData.images = [
          ...variantData.images.map((data) => replaceS3BaseUrl(data)),
          ...images,
        ];
        variantData.videos = [
          ...variantData.videos.map((data) => replaceS3BaseUrl(data)),
          ...videos,
        ];
        variantData.mainImages = main
          ? replaceS3BaseUrl(main)
          : replaceS3BaseUrl(variantData.mainImages);
      }
      console.log(
        "🚀 ~ file: productController.js:2225 ~ variantData:",
        variantData._id
      );
      let variantRes = await otherProductModels.findOneAndUpdate(
        { _id: variantData._id },
        { $set: variantData },
        { useFindAndModify: false, new: true }
      );

      res.status(200).send({
        success: true,
        message: "Update Products Successfully",
        data: {
          variants: variantRes,
        },
      });
    } catch (error) {
      console.log("🚀 ~ file: productController.js:2249 ~ error:", error);
      res.status(400).send({
        success: false,
        message: "Error in processing",
        data: error,
      });
    }
  },
  DeleteOtherProducts: async function (req, res) {
    try {
      const variant = await otherProductModels.findByIdAndDelete(req.params.id);
      res.status(200).send({
        message: "Variants deleted successfully",
        data: variant,
        success: true,
      });
    } catch (error) {
      res.status(400).send({
        message: "Something went wrong",
        error: error,
        success: false,
      });
    }
  },
  updateall: async function (req, res) {
    try {
      const customers = await otherProductModels.find();
      const customer = await customers.forEach(async (data1) => {
        const data = JSON.parse(JSON.stringify(data1));
        let newMain = "";
        if (
          (data?.mainImages && data.mainImages !== undefined) ||
          data.mainImages !== null
        ) {
          newMain = data?.mainImages?.replace(
            "https://wedcell.s3.ap-south-1.amazonaws.com",
            ""
          );
        }
        const newimages = data?.images?.map((d) => {
          d = d?.replace("https://wedcell.s3.ap-south-1.amazonaws.com", "");
          return d;
        });
        const newVideos = data?.videos?.map((d) => {
          d = d?.replace("https://wedcell.s3.ap-south-1.amazonaws.com", "");
          return d;
        });

        const w = {
          mainImages: newMain,
          images: newimages,
          videos: newVideos,
        };
        const a = await otherProductModels.updateOne(
          { _id: data._id },
          {
            $set: w,
          }
        );
      });
      res.send({
        data: customer,
      });
    } catch (error) {
      res.send({
        success: true,
        error,
        // length: data4.length,
      });
    }
  },
};
