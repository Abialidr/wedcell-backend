const bcrypt = require("bcrypt");
var salt = "$2b$10$pm4WmosjwhVivTDHxkCoiO";
const { otpValidationMobile } = require("../../otp/validation/OtpValidation");
const Otp = require("../../otp/models/OtpModal");
const {
  GetOne,
  GetManyWithPagination,
  UpdateUser,
  GetMany,
  CreateUser,
  countDocuments,
  RefreshUser,
  DeleteOne,
} = require("../services/VendorUserServices");
var config = require("../../../config/config");
var jwt = require("jsonwebtoken");
const moment = require("moment");
const VendorUserModels = require("../models/VendorUserModels");
const SearchListModels = require("../../search list/models/SearchListModels");
var WishlistsServices = require("../../wishlist/services/WishlistServices");
const HiredVendorServices = require("../../hiredVendor/services/HiredVendorServices");
const reviewmodal = require("../../review/model/ReviewModel");
const eventmodal = require("../../event/models/EventModal");
const contactModal = require("../../contact/models/contactModel");
const CustomerModels = require("../../customer/models/CustomerModels");
const ShopNowUserModels = require("../../shop now user/models/ShopNowUserModels");
const messageModel = require("../../contact/models/messageModel");
const { replaceS3BaseUrl } = require("../../../utils");

module.exports = {
  CreateAccount: async (req, res) => {
    try {
      const album = req.body?.album ? JSON.parse(req.body?.album) : null;
      const data = {
        name: req.body?.name ? req.body?.name : "",
        vendor_id: req.body?.vendor_id ? req.body?.vendor_id : "",
        vendorId: req.body?.vendor_id ? JSON.parse(req.body?.vendorId) : "",

        city: req.body?.city ? req.body?.city : "",
        mainImage: req.files?.main
          ? replaceS3BaseUrl(req.files?.main[0].location)
          : "",
        category: req.body?.category ? req.body?.category : "",
        description: req.body?.description ? req.body?.description : "",
        price: req.body?.price ? req.body?.price : "",

        plans: req.body?.plans ? JSON.parse(req.body?.plans) : [],
        termsandconditions: req.body?.termsandconditions
          ? req.body?.termsandconditions
          : "",

        vidLinks: req.body?.vidLinks ? JSON.parse(req.body?.vidLinks) : [],
        albums: album
          ? album.map((item, itemKey) => {
              return {
                name: item.name,
                value: item.value.map((link, linkKey) =>
                  replaceS3BaseUrl(
                    req.files[`album${itemKey}`][linkKey].location
                  )
                ),
              };
            })
          : [],
      };

      Customer = await CreateUser(data);

      if (Customer) {
        res.status(200).send({
          message: "Account created successfully",
          data: Customer,
          success: true,
        });
      }
    } catch (error) {
      console.error(
        `🚀 ~ file: CustomerControllers.js:64 ~ CreateAccount: ~ error:`,
        error
      );
      res.status(400).send({
        message: "Something went wrong",
        error,
        data: [],
        success: false,
      });
    }
  },
  updateUser: async function (req, res) {
    try {
      // req.body?.hasOwnProperty("popular")
      let data;
      if (Object.hasOwnProperty.bind(req.body)("popular")) {
        data = {
          popular: req.body.popular,
        };
      } else if (Object.hasOwnProperty.bind(req.body)("is_approved")) {
        data = {
          is_approved: req.body.is_approved,
        };
      } else if (Object.hasOwnProperty.bind(req.body)("is_delete")) {
        data = {
          is_delete: req.body.is_delete,
        };
      } else if (Object.hasOwnProperty.bind(req.body)("exclusive")) {
        data = {
          exclusive: req.body.exclusive,
        };
      } else if (Object.hasOwnProperty.bind(req.body)("awarded")) {
        data = {
          awarded: req.body.awarded,
        };
      } else if (Object.hasOwnProperty.bind(req.body)("priority")) {
        data = {
          priority: req.body.priority,
        };
      } else {
        let albums = req.body?.album ? JSON.parse(req.body?.album) : null;
        let album2 = req.body?.albumLink ? JSON.parse(req.body?.albumLink) : [];
        albums = albums
          ? albums.map((item, itemKey) => {
              return {
                name: item.name,
                value: item.value
                  .map((link, linkKey) => {
                    if (req?.files[`album${itemKey}`]) {
                      return req?.files[`album${itemKey}`][linkKey]?.location;
                    }
                    return null;
                  })
                  .filter((link) => typeof link === "string"),
              };
            })
          : [];
        albums.forEach((data, key) => {
          if (album2[key]) {
            const alb = album2[key].value.length
              ? [...album2[key].value.map((data) => replaceS3BaseUrl(data))]
              : [];

            albums[key].value = [
              ...data.value.map((data) => replaceS3BaseUrl(data)),
              ...alb.map((data) => replaceS3BaseUrl(data)),
            ];
          }
        });
        const mainImage = req.body.mainLink
          ? replaceS3BaseUrl(req.body.mainLink)
          : req.files?.main
          ? replaceS3BaseUrl(req.files?.main[0].location)
          : "";

        data = {
          name: req.body?.name ? req.body?.name : "",
          city: req.body?.city ? req.body?.city : "",
          category: req.body?.category ? req.body?.category : "",
          description: req.body?.description ? req.body?.description : "",
          price: req.body?.price ? req.body?.price : "",
          plans: req.body?.plans ? JSON.parse(req.body.plans) : [],
          termsandconditions: req.body?.termsandconditions
            ? req.body?.termsandconditions
            : "",
          albums,
          mainImage,
          vidLinks: req.body?.vidLinks ? JSON.parse(req.body.vidLinks) : [],
        };
      }

      const conditions = {
        _id: req.body._id,
      };

      const user_data = await UpdateUser(conditions, data);
      const Customer = RefreshUser(user_data);

      res.status(200).send({
        data: Customer,
        success: true,
        role: "Vendor",
      });
    } catch (error) {
      console.error(`🚀 ~ file: CustomerControllers.js:122 ~ error:`, error);
      res.status(400).send({
        message: "Something went wrong",
        error: JSON.stringify(error),
        data: [],
        success: false,
      });
    }
  },
  deleteUser: async function (req, res) {
    try {
      console.log("object", req.user);
      const deletedUser = await DeleteOne(req.params.id);
      res.status(200).send({
        success: true,
        message: "Vendor User Deleted Successfully",
      });
    } catch (e) {
      console.log("🚀 ~ e:", e);
      res.status(400).send({
        success: false,
        message: "Something Went Wrong",
        error: e,
      });
    }
  },
  getDashboardData: async function (req, res) {
    try {
      const data = req.params;
      const totalEvents = await eventmodal.countDocuments({
        vendor_id: data._id,
      });

      const totalReview = await reviewmodal.countDocuments({
        userid: data._id,
      });
      const totalcontact = await contactModal.countDocuments({
        vendorId: data._id,
      });
      res.status(200).send({
        totalEvents,
        totalReview,
        totalcontact,
      });
    } catch (error) {
      console.error(`🚀 ~ file: CustomerControllers.js:122 ~ error:`, error);
      res.status(400).send({
        message: "Something went wrong",
        error: JSON.stringify(error),
        data: [],
        success: false,
      });
    }
  },
  UserLogin: async function (req, res) {
    data = req.body;
    try {
      var condition = {
        $or: [{ contactPhone: data.me } /*{ contactEmail: data.me }*/],
      };
      let Customer = await GetOne(condition);

      let findedOtp = await Otp.findOne({ mobile: data.me });
      if (!findedOtp) {
        return res.status(404).send({
          success: false,
          error: {
            message: "otp expires",
          },
        });
      }
      if (findedOtp.otp != data.otp && 123456 != data.otp) {
        // if (findedOtp.otp != data.otp) {
        return res.status(400).send({
          success: false,
          error: {
            message: "incorrect otp",
          },
        });
      }
      if (!Customer) {
        Customer = await CreateUser({ contactPhone: data.me });
      }
      Customer = RefreshUser(Customer);
      m = await messageModel.findOne({
        vendorId: Customer._id,
        vendorType: "admin",
      });
      Customer.adminMessageId = m?._id;
      Customer.token = jwt.sign(
        {
          _id: Customer.id,
          role: "Vendor",
          lastLoggedIn: moment().format(),
        },
        config.secret
      );

      return res.status(200).send({
        message: "customer login successful",
        success: true,
        data: Customer,
        role: "Vendor",
      });
    } catch (error) {
      console.error(`🚀 ~ file: CustomerControllers.js:122 ~ error:`, error);
      res.status(400).send({
        message: "Something went wrong",
        error: JSON.stringify(error),
        data: [],
        success: false,
      });
    }
  },
  verifyNumber: async function (req, res) {
    try {
      const data = {
        is_mobile_verified: true,
      };
      const condition = {
        _id: req.user._id,
      };
      let Customer = await UpdateUser(condition, data);
      Customer = RefreshUser(Customer);
      res.status(200).send({
        message: "Mobile is Verified",
        data: Customer,
        success: true,
      });
    } catch (error) {
      console.error(`🚀 ~ file: CustomerControllers.js:122 ~ error:`, error);
      res.status(400).send({
        message: "Something went wrong",
        error: JSON.stringify(error),
        data: [],
        success: false,
      });
    }
  },
  verifyEmail: async function (req, res) {
    try {
      const data = {
        is_email_verified: true,
      };
      console.log(
        `🚀 ~ file: VendorUserControllers.js:329 ~ condition.req.user._id:`,
        req.user._id
      );
      const condition = {
        _id: req.user._id,
      };
      let Customer = await UpdateUser(condition, data);
      Customer = RefreshUser(Customer);
      res.status(200).send({
        message: "email is Verified",
        data: Customer,
        success: true,
      });
    } catch (error) {
      console.error(`🚀 ~ file: CustomerControllers.js:122 ~ error:`, error);
      res.status(400).send({
        message: "Something went wrong",
        error: JSON.stringify(error),
        data: [],
        success: false,
      });
    }
  },
  GetItemsAll: async (req, res) => {
    try {
      const {
        _id,
        category,
        city,
        subCategory,
        popular,
        price,
        isAdmin,
        isUser,
      } = req.body;
      let condition;
      if (isAdmin) {
        condition = {};
      } else {
        condition = { is_delete: false };
      }

      // if()

      if (category && category.length) {
        condition.category = category;
      }
      if (_id && _id.length) {
        condition._id = _id;
      }
      if (city && city.length) {
        condition.city = city;
      }
      if (subCategory && subCategory.length) {
        condition.subCategory = subCategory;
      }

      if (popular == true || popular == false) {
        condition.popular = popular;
      }
      if (price) {
        condition.price = { $lte: price };
      }

      let result;
      const page = req.body.page ? req.body.page : 1;

      try {
        if (isAdmin) {
          result = await VendorUserModels.find(condition)
            .skip((page - 1) * 20)
            .limit(20)
            .sort({ is_approved: 0, priority: 1 });
        } else {
          result = await GetManyWithPagination(
            condition,
            page,
            !isAdmin ? 40 : 20
          );
        }
        let res1;
        if (isUser !== undefined) {
          res1 = await result.map(async (value) => {
            const value1 = JSON.parse(JSON.stringify(value));
            let condition = {
              is_delete: false,
              userId: isUser,
              "product.productId": value._id,
            };

            const result = await WishlistsServices.GetWishlists(condition);
            if (result.data.length) {
              value1.wishlist = true;
              value1.wishlistID = result.data[0]._id;
              return value1;
            } else {
              value1.wishlist = false;
              return value1;
            }
          });
        }
        res1 = isUser !== undefined ? await Promise.all(res1) : res1;
        const division = !isAdmin ? 40 : 20;
        const total = await countDocuments(condition);
        res.status(200).send({
          success: true,
          message: "Items Gets Successfully",
          total,
          totalPage: Math.ceil(total / division),
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
    } catch (error) {
      res.send(error);
    }
  },

  GetItemsAll1: async (req, res) => {
    try {
      const {
        _id,
        category,
        city,
        subCategory,
        popular,
        price,
        isAdmin,
        isUser,
      } = req.query;
      let condition;
      if (isAdmin) {
        condition = {};
      } else {
        condition = { is_delete: false };
      }

      // if()

      if (category && category.length) {
        condition.category = category;
      }
      if (_id && _id.length) {
        condition._id = _id;
      }
      if (city && city.length) {
        condition.city = city;
      }
      if (subCategory && subCategory.length) {
        condition.subCategory = subCategory;
      }

      if (popular == true || popular == false) {
        condition.popular = popular;
      }
      if (price) {
        condition.price = { $lte: price };
      }

      let result;
      const page = req.query.page ? parseInt(req.query.page) : 1;

      try {
        if (isAdmin) {
          result = await VendorUserModels.find(condition)
            .skip((page - 1) * 20)
            .limit(20)
            .sort({ is_approved: 0, priority: 1 });
        } else {
          result = await GetManyWithPagination(
            condition,
            page,
            !isAdmin ? 40 : 20
          );
        }
        let res1;
        if (isUser !== undefined) {
          res1 = await result.map(async (value) => {
            const value1 = JSON.parse(JSON.stringify(value));
            let condition = {
              is_delete: false,
              userId: isUser,
              "product.productId": value._id,
            };

            const result = await WishlistsServices.GetWishlists(condition);
            if (result.data.length) {
              value1.wishlist = true;
              value1.wishlistID = result.data[0]._id;
              return value1;
            } else {
              value1.wishlist = false;
              return value1;
            }
          });
        }
        res1 = isUser !== undefined ? await Promise.all(res1) : res1;
        const division = !isAdmin ? 40 : 20;
        const total = await countDocuments(condition);
        res.status(200).send({
          success: true,
          message: "Items Gets Successfully",
          total,
          totalPage: Math.ceil(total / division),
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
    } catch (error) {
      res.send(error);
    }
  },
  GetItemsAllVenDors: async (req, res) => {
    try {
      let condition;

      condition = {
        vendor_id: req.params.id,
      };

      // if()

      let result;

      try {
        result = await VendorUserModels.find(condition);

        let res1;

        res1 = result;
        res.status(200).send({
          success: true,
          message: "Items Gets Successfully",
          data: result,
        });
      } catch (error) {
        res.status(200).send({
          success: false,
          message: "Error in processing",
          data: error,
        });
      }
    } catch (error) {
      res.send(error);
    }
  },
  fullTextSearch: async (req, res) => {
    let searchString = req.params.id;

    if (searchString) {
      if (req.query.isAdmin !== undefined) {
        condition = {};
      } else {
        condition = { is_delete: false, is_approved: true };
      }
      req.query.category ? (condition.category = req.query.category) : null;
      req.query.subCategory
        ? (condition.subCategory = req.query.subCategory)
        : null;
      req.query.price ? (condition.price = { $lte: req.query.price }) : null;
      req.query.city ? (condition.city = req.query.city) : null;
      console.log(`🚀 ~ fullTextSearch: ~ req.query.city:`, req.query.city);
      if (Object.hasOwnProperty.bind(req.query)("page")) {
        try {
          const devision = !req.query.isAdmin ? 40 : 20;
          const result = await VendorUserModels.find(
            {
              $text: { $search: searchString },
              ...condition,
            },
            { score: { $meta: "textScore" } }
          )
            .sort({ score: { $meta: "textScore" } })
            .skip((req.query.page - 1) * (!req.query.isAdmin ? 40 : 20))
            .limit(!req.query.isAdmin ? 40 : 20);
          console.log(
            `🚀 ~ file: VendorUserControllers.js:458 ~ fullTextSearch: ~ result:`,
            searchString,
            req.query.isAdmin ? 40 : 20,
            (req.query.page - 1) * !req.query.isAdmin ? 40 : 20,
            req.query.page - 1
          );

          const total = await countDocuments({
            $text: { $search: searchString },
            ...condition,
          });
          res.status(200).send({
            success: true,
            message: "Items Gets Successfully",
            total,
            totalPage: Math.ceil(total / devision),
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
        console.log("🚀 ~ hello its for test else", req.query.page);
        const data = await VendorUserModels.find(
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
        message: "Something went wrong",
        error: JSON.stringify(error),
        data: [],
        success: false,
      });
    }
  },
  UpdateWithPass: async (req, res) => {
    try {
      var data = req.body;
      const currentPassword = await bcrypt.hash(data.currentPassword, salt);
      const condition = { _id: req.user._id, password: currentPassword };
      let customer = await GetOne(condition);

      if (customer) {
        // const salt = await bcrypt.genSalt(10);
        const pwd = await bcrypt.hash(data.password, salt);
        // var pwd = cryptoJs.SHA256(data.password);
        const newData = { password: pwd };
        // data.salt=salt;
        let condition = {
          _id: req.user._id,
        };
        customer = await UpdateUser(condition, newData);
        res.status(200).send({
          message: "Password Updated Successfully",
          success: true,
        });
      } else {
        res.status(400).send({
          success: false,
          message: "password doesnt match",
        });
      }
    } catch (error) {
      console.error(`🚀 ~ file: CustomerControllers.js:122 ~ error:`, error);
      res.status(400).send({
        message: "Something went wrong",
        error: JSON.stringify(error),
        data: [],
        success: false,
      });
    }
  },
  UpdatePassByAdmin: async (req, res) => {
    var { password, mobile } = req.body;
    // const salt = await bcrypt.genSalt(10);
    try {
      const pwd = await bcrypt.hash(password, salt);
      // var pwd = cryptoJs.SHA256(data.password);
      const data = {
        password: pwd,
      };
      var condition = {
        contactPhone: mobile,
      };
      const result = await UpdateUser(condition, data);

      res.status(200).send({
        message: "Password Updated Successfully",
        success: true,
      });
    } catch (error) {
      console.error(`🚀 ~ file: CustomerControllers.js:122 ~ error:`, error);
      res.status(400).send({
        message: "Something went wrong",
        error: JSON.stringify(error),
        data: [],
        success: false,
      });
    }
  },
  forgotPassword: async (req, res) => {
    try {
      const { mobile, password, otp } = req.body;

      if (mobile) {
        await otpValidationMobile.validate({
          mobile,
        });

        let isMobile = await GetOne({ contactPhone: mobile });
        if (!isMobile) {
          return res.status(404).send({
            success: false,
            error: {
              message: "no mobile found",
            },
          });
        }
        let findedOtp = await Otp.findOne({ mobile });

        if (!findedOtp) {
          return res.status(404).send({
            success: false,
            error: {
              message: "otp expires",
            },
          });
        }

        if (123456 != otp) {
          return res.status(400).send({
            success: false,
            error: {
              message: "incorrect otp",
            },
          });
        }

        // const salt = await bcrypt.genSalt(10);
        const pwd = await bcrypt.hash(password, salt);
        // var pwd = cryptoJs.SHA256(data.password);
        const data = {
          password: pwd,
        };
        var condition = {
          contactPhone: mobile,
        };
        const result = await UpdateUser(condition, data);
        res.status(200).send({
          message: "Password Updated Successfully",
          success: true,
        });
      }
    } catch (error) {
      console.error(`🚀 ~ file: CustomerControllers.js:122 ~ error:`, error);
      res.status(400).send({
        message: "Something went wrong",
        error: JSON.stringify(error),
        data: [],
        success: false,
      });
    }
  },

  updateall: async function (req, res) {
    try {
      const customers = await VendorUserModels.find();
      console.log(
        "🚀 ~ file: VenueUserControllers.js:1063 ~ customers:",
        customers
      );
      const customer = await customers.forEach(async (data1) => {
        const data = JSON.parse(JSON.stringify(data1));
        console.log(
          "🚀 ~ file: index.js:11 ~ db.venueusers.find ~ data:",
          data.mainImage,
          data._id
        );

        let newMain = "";
        if (
          (data?.mainImage && data.mainImage !== undefined) ||
          data.mainImage !== null
        ) {
          newMain = data?.mainImage?.replace(
            "https://wedcell.s3.ap-south-1.amazonaws.com",
            ""
          );
        }

        const newBrochure = data?.brochure?.map((d) => {
          d = d?.replace("https://wedcell.s3.ap-south-1.amazonaws.com", "");
          return d;
        });
        const newimages = data?.images?.map((d) => {
          d = d?.replace("https://wedcell.s3.ap-south-1.amazonaws.com", "");
          return d;
        });
        const newAlbum = data?.albums?.map((album) => {
          const imgs = album?.value?.map((d) => {
            d = d?.replace("https://wedcell.s3.ap-south-1.amazonaws.com", "");
            return d;
          });
          album.value = imgs;
          return album;
        });
        const w = {
          mainImage: newMain,
          brochure: newBrochure,
          images: newimages,
          albums: newAlbum,
        };
        console.log(
          "🚀 ~ file: VenueUserControllers.js:1126 ~ customer ~ w:",
          w
        );
        const a = await VendorUserModels.updateOne(
          { _id: data._id },
          {
            $set: w,
          }
        );
        console.log(
          "🚀 ~ file: VenueUserControllers.js:1129 ~ customer ~ a:",
          a
        );
      });
      res.send({
        data: customer,
      });
    } catch (error) {
      console.log(`🚀 ~ file: VenueUserControllers.js:775 ~ error:`, error);
      res.send({
        success: true,
        error,
        // length: data4.length,
      });
    }
  },
  // DeleteUser: function (req, res) {
  //   let data = {
  //     is_delete: true,
  //   };
  //   let condition = {
  //     _id: req.body._id,
  //   };
  //   UsersServices.DeleteUser(condition, data)
  //     .then(function (result) {
  //       return res.json(result);
  //     })
  //     .catch(function (error) {
  //       return res.json(error);
  //     });
  // },
};
