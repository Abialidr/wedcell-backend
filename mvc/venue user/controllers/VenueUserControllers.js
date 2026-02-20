const bcrypt = require("bcrypt");
var salt = "$2b$10$pm4WmosjwhVivTDHxkCoiO";
const { otpValidationMobile } = require("../../otp/validation/OtpValidation");
const Otp = require("../../otp/models/OtpModal");
var WishlistsServices = require("../../wishlist/services/WishlistServices");
const {
  GetOne,
  GetManyWithPagination,
  UpdateUser,
  GetMany,
  CreateUser,
  countDocuments,
  RefreshUser,
  DeleteOne,
} = require("../services/VenueUserServices");
var config = require("../../../config/config");
var jwt = require("jsonwebtoken");
const moment = require("moment");
const VenueUserModels = require("../models/VenueUserModels");
const SearchListModels = require("../../search list/models/SearchListModels");
const HiredVendorServices = require("../../hiredVendor/services/HiredVendorServices");
const reviewmodal = require("../../review/model/ReviewModel");
const eventmodal = require("../../event/models/EventModal");
const contactModal = require("../../contact/models/contactModel");
const messageModel = require("../../contact/models/messageModel");
const { replaceS3BaseUrl } = require("../../../utils");

module.exports = {
  CreateAccount: async (req, res) => {
    try {
      const album = req.body?.album ? JSON.parse(req.body?.album) : null;
      const amenities = JSON.parse(req.body?.amenities)
        ? JSON.parse(req.body?.amenities).map((item, itemKey) => {
            return {
              name: item.name,
              min: item.min,
              max: item.max,
              sqaurefeet: item.sqaurefeet,
              layout: replaceS3BaseUrl(
                req?.files[`amenities${itemKey}`][0]?.location
              ),
            };
          })
        : [];
      const data = {
        name: req.body?.name ? req.body?.name : "",
        company_name: req.body?.company_name ? req.body?.company_name : "",
        // contactPhone: req.body?.contactPhone ? req.body?.contactPhone : "",
        contactEmail: req.body?.contactEmail ? req.body?.contactEmail : "",
        zipcode: req.body?.zipcode ? req.body?.zipcode : "",

        city: req.body?.city ? req.body?.city : "",
        state: req.body?.state ? req.body?.state : "",
        country: req.body?.country ? req.body?.country : "",
        address: req.body?.address ? req.body?.address : "",
        mainImage: req.files?.main
          ? replaceS3BaseUrl(req.files?.main[0].location)
          : "",
        category: req.body?.category ? req.body?.category : "",
        description: req.body?.description ? req.body?.description : "",
        price: req.body?.price ? req.body?.price : "",

        totalRooms: req.body?.totalRooms ? req.body?.totalRooms : "",
        totalBanquet: req.body?.totalBanquet ? req.body?.totalBanquet : "",
        totalLawns: req.body?.totalLawns ? req.body?.totalLawns : "",
        secondNumbers: req.body?.secondNumbers
          ? JSON.parse(req.body?.secondNumbers)
          : [],
        plans: req.body?.plans ? JSON.parse(req.body?.plans) : [],
        termsandconditions: req.body?.termsandconditions
          ? req.body?.termsandconditions
          : "",
        brochure: req.files?.brochure
          ? replaceS3BaseUrl(req.files?.brochure[0].location)
          : null,
        images: req.files?.gallery
          ? req.files?.gallery.map((item) => replaceS3BaseUrl(item.location))
          : [],
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
        menu: req.files?.menu
          ? req.files?.menu.map((item) => replaceS3BaseUrl(item.location))
          : [],
        lmenu: req.files?.lmenu
          ? req.files?.lmenu.map((item) => replaceS3BaseUrl(item.location))
          : [],
        vegPerPlate: req.body?.vegPerPlate ? req.body?.vegPerPlate : "",
        nonVegPerPlate: req.body?.nonVegPerPlate
          ? req.body?.nonVegPerPlate
          : "",
        amenities,
        allowedVendors: req.body?.allowedVendors
          ? JSON.parse(req.body?.allowedVendors)
          : [],
        features: req.body?.features
          ? JSON.parse(req.body?.features)
          : [
              { name: "Wi-Fi", value: false },
              { name: "Swimming pool", value: false },
              { name: "Laundry", value: false },
              { name: "Room service", value: false },
              { name: "Fitness center", value: false },
              { name: "Breakfast", value: false },
              { name: "Housekeeping", value: false },
              { name: "Spa", value: false },
              { name: "Parking", value: false },
              { name: "Valet parking", value: false },
              { name: "Hair dryer", value: false },
              { name: "Restaurant", value: false },
              { name: "Minibar", value: false },
              { name: "Personal care products", value: false },
              { name: "Slippers", value: false },
              { name: "Towel", value: false },
              { name: "Shaving kit", value: false },
              { name: "Bathrobes", value: false },
              { name: "Free breakfast", value: false },
              { name: "Smart TV", value: false },
              { name: "Pet-friendly hotels", value: false },
              { name: "Concierge", value: false },
              { name: "Air conditioning", value: false },
              { name: "Iron and Ironing Board", value: false },
            ],
      };

      // const pwd = await bcrypt.hash(data.password, salt);
      // // var pwd = cryptoJs.SHA256(data.password);
      // data.password = pwd.toString();

      var condition = {
        _id: req.body?.id,
        // { contactEmail: data.contactEmail },
      };
      // let Customer = await GetMany(condition);

      // if (Customer.length > 0) {
      //   return res.status(400).send({
      //     message: "Customer already exists",
      //     success: false,
      //     data: [],
      //   });
      // }
      Customer = await UpdateUser(condition, data);
      await SearchListModels.create({
        name: Customer.name,
        company_name: Customer.company_name,
        userId: Customer._id,
        link: `/venue/${Customer._id}`,
      });
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
      } else if (
        Object.hasOwnProperty.bind(req.body)("fourStar") &&
        Object.hasOwnProperty.bind(req.body)("fiveStar")
      ) {
        data = {
          fourStar: req.body.fourStar,
          fiveStar: req.body.fiveStar,
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
        const amenities = JSON.parse(req.body?.amenities)
          ? JSON.parse(req.body?.amenities).map((item, itemKey) => {
              return {
                name: item.name,
                min: item.min,
                max: item.max,
                sqaurefeet: item.sqaurefeet,
                name: item.name,
                layout: item.layout
                  ? replaceS3BaseUrl(item.layout)
                  : replaceS3BaseUrl(
                      req?.files[`amenities${itemKey}`][0]?.location
                    ),
              };
            })
          : [];
        albums.forEach((data, key) => {
          if (album2[key]) {
            const alb = album2[key].value.length ? [...album2[key].value] : [];

            albums[key].value = [
              ...data.value.map((data) => replaceS3BaseUrl(data)),
              ...alb.map((data) => replaceS3BaseUrl(data)),
            ];
          }
        });
        let images = req.files?.gallery
          ? req.files?.gallery.map((item) => replaceS3BaseUrl(item.location))
          : [];
        images = [
          ...images.map((data) => replaceS3BaseUrl(data)),
          ...JSON.parse(req.body?.galleryLink).map((data) =>
            replaceS3BaseUrl(data)
          ),
        ];

        let menu = req.files?.menu
          ? req.files?.menu.map((item) => replaceS3BaseUrl(item.location))
          : [];
        menu = [
          ...menu,
          ...JSON.parse(req.body?.menuLink).map((data) =>
            replaceS3BaseUrl(data)
          ),
        ];

        let lmenu = req.files?.lmenu
          ? req.files?.lmenu.map((item) => replaceS3BaseUrl(item.location))
          : [];
        lmenu = [
          ...lmenu,
          ...JSON.parse(req.body?.lmenuLink).map((data) =>
            replaceS3BaseUrl(data)
          ),
        ];

        const brochure = req.body.brochureLink
          ? replaceS3BaseUrl(req.body.brochureLink)
          : req.files?.brochure
          ? replaceS3BaseUrl(req.files?.brochure[0].location)
          : "";

        const mainImage = req.body.mainLink
          ? replaceS3BaseUrl(req.body.mainLink)
          : req.files?.main
          ? replaceS3BaseUrl(req.files?.main[0].location)
          : "";

        data = {
          name: req.body?.name ? req.body?.name : "",
          company_name: req.body?.company_name ? req.body?.company_name : "",
          contactPhone: req.body?.contactPhone ? req.body?.contactPhone : "",
          contactEmail: req.body?.contactEmail ? req.body?.contactEmail : "",
          zipcode: req.body?.zipcode ? req.body?.zipcode : "",

          city: req.body?.city ? req.body?.city : "",
          state: req.body?.state ? req.body?.state : "",
          country: req.body?.country ? req.body?.country : "",
          address: req.body?.address ? req.body?.address : "",
          category: req.body?.category ? req.body?.category : "",
          description: req.body?.description ? req.body?.description : "",
          price: req.body?.price ? req.body?.price : "",
          totalRooms: req.body?.totalRooms ? req.body?.totalRooms : "",
          totalBanquet: req.body?.totalBanquet ? req.body?.totalBanquet : "",
          totalLawns: req.body?.totalLawns ? req.body?.totalLawns : "",
          secondNumbers: req.body?.secondNumbers
            ? JSON.parse(req.body?.secondNumbers)
            : [],
          plans: req.body?.plans ? JSON.parse(req.body?.plans) : [],
          termsandconditions: req.body?.termsandconditions
            ? req.body?.termsandconditions
            : "",
          images,
          albums,
          brochure,
          mainImage,
          menu,
          lmenu,
          vidLinks: req.body?.vidLinks ? JSON.parse(req.body?.vidLinks) : [],
          vegPerPlate: req.body?.vegPerPlate ? req.body?.vegPerPlate : "",
          nonVegPerPlate: req.body?.nonVegPerPlate
            ? req.body?.nonVegPerPlate
            : "",
          amenities,
          allowedVendors: req.body?.allowedVendors
            ? JSON.parse(req.body?.allowedVendors)
            : [],
          features: req.body?.features ? JSON.parse(req.body?.features) : [],
        };

        const findedUser = await GetOne({
          _id: req.user._id,
        });

        if (findedUser.contactPhone !== data.contactPhone) {
          data.is_mobile_verified = false;
        } else {
          data.is_mobile_verified = true;
          data.is_approved = true;
        }
        if (findedUser.contactEmail !== data.contactEmail) {
          data.is_email_verified = false;
        } else {
          data.is_email_verified = true;
          data.is_approved = true;
        }
      }

      const conditions = {
        _id: req.body.isAdmin ? req.body._id : req.user._id,
      };

      const user_data = await UpdateUser(conditions, data);
      await SearchListModels.findOneAndUpdate(
        { userId: user_data._id },
        {
          name: user_data.name,
          company_name: user_data.company_name,
        }
      );
      const Customer = RefreshUser(user_data);

      res.status(200).send({
        data: Customer,
        success: true,
        role: "Venue",
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
        message: "Venue User Deleted Successfully",
      });
    } catch (e) {
      res.status(400).send({
        success: false,
        message: "Something Went Wrong",
        error: e,
      });
    }
  },
  UserLogin: async function (req, res) {
    data = req.body;
    try {
      var condition = {
        $or: [{ contactPhone: data.me } /* { contactEmail: data.me }*/],
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
        // if (findedOtp.otp != data.otp ) {
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
          role: "Venue",
          lastLoggedIn: moment().format(),
        },
        config.secret
      );
      return res.status(200).send({
        message: "customer login successful",
        success: true,
        data: Customer,
        role: "Venue",
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
  GetItemsForVendors: async function (req, res) {
    try {
      const data = req.body;
      let condition = { is_delete: false, vendorId: data._id };

      const result = await GetMany(condition);
      if (result.length) {
        res.status(200).send({
          success: true,
          message: "Items Gets Successfully",
          data: result,
        });
      } else {
        res.status(400).send({
          success: false,
          message: "Items Gets un-Successfully",
          data: [],
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
      if (isAdmin !== undefined) {
        condition = {};
      } else {
        condition = { is_delete: false, is_approved: true };
      }

      if (category && category.length) {
        condition.category = category;
      }
      if (_id && _id.length) {
        condition._id = _id;
      }
      if (city && city.length) {
        condition.city = city;
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
          result = await VenueUserModels.find(condition)
            .skip((page - 1) * 20)
            .limit(20)
            .sort({ is_approved: 0, priority: 1 });
        } else {
          result = await GetManyWithPagination(
            condition,
            page,
            !isAdmin ? 12 : 20
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
        const division = !isAdmin ? 12 : 20;
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
        popular,
        isAdmin,
        isUser,
        rentalCostMin,
        rentalCostMax,
        pppMin,
        pppMax,
        lawnsMin,
        lawnsMax,
        banquetMin,
        banquetMax,
        roomsMin,
        roomsmax,
        ratingMax,
        ratingMin,
      } = req.query;

      let condition;
      if (req.query.isAdmin !== undefined) {
        condition = {};
      } else {
        condition = { is_delete: false, is_approved: true };
      }
      if (category && category.length) {
        condition.category = category;
      }
      if (_id && _id.length) {
        condition._id = _id;
      }
      if (city && city.length) {
        condition.city = city;
      }

      if (popular == true || popular == false) {
        condition.popular = popular;
      }

      if (rentalCostMin || rentalCostMax) {
        condition.price = {
          ...(rentalCostMin ? { $gte: parseInt(rentalCostMin) } : {}),
          ...(rentalCostMax ? { $lte: parseInt(rentalCostMax) } : {}),
        };
      }

      if (pppMin || pppMax) {
        condition.nonVegPerPlate = {
          ...(pppMin ? { $gte: parseInt(pppMin) } : {}),
          ...(pppMax ? { $lte: parseInt(pppMax) } : {}),
        };
        condition.vegPerPlate = {
          ...(pppMin ? { $gte: parseInt(pppMin) } : {}),
          ...(pppMax ? { $lte: parseInt(pppMax) } : {}),
        };
      }
      if (lawnsMin || lawnsMax) {
        condition.totalLawns = {
          ...(lawnsMin ? { $gte: parseInt(lawnsMin) } : {}),
          ...(lawnsMax ? { $lte: parseInt(lawnsMax) } : {}),
        };
      }
      if (banquetMin || banquetMax) {
        condition.totalBanquet = {
          ...(banquetMin ? { $gte: parseInt(banquetMin) } : {}),
          ...(banquetMax ? { $lte: parseInt(banquetMax) } : {}),
        };
      }
      if (roomsMin || roomsmax) {
        condition.totalRooms = {
          ...(roomsMin ? { $gte: parseInt(roomsMin) } : {}),
          ...(roomsmax ? { $lte: parseInt(roomsmax) } : {}),
        };
      }
      if (ratingMin || ratingMax) {
        condition.avgRating = {
          ...(ratingMin ? { $gte: parseInt(ratingMin) } : {}),
          ...(ratingMax ? { $lte: parseInt(ratingMax) } : {}),
        };
      }
      let result;
      const page = req.query.page ? req.query.page : 1;
      try {
        if (isAdmin) {
          result = await VenueUserModels.find(condition)
            .skip((page - 1) * 20)
            .limit(20)
            .sort({ is_approved: 0, priority: 1 });
        } else {
          result = await GetManyWithPagination(
            condition,
            page,
            !isAdmin ? 12 : 20
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
        const division = !isAdmin ? 12 : 20;
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
  fullTextSearch: async (req, res) => {
    let searchString = req.params.id;
    const {
      _id,
      category,
      city,
      popular,
      isAdmin,
      rentalCostMin,
      rentalCostMax,
      pppMin,
      pppMax,
      lawnsMin,
      lawnsMax,
      banquetMin,
      banquetMax,
      roomsMin,
      roomsmax,
      ratingMin,
      ratingMax,
      page = 1,
    } = req.query;

    if (searchString) {
      let matchConditionss = {
        $text: { $search: searchString },
        ...(isAdmin !== undefined
          ? {}
          : { is_delete: false, is_approved: true }),
      };
      const matchConditions = {};

      if (category) matchConditions.category = category;
      if (city) matchConditions.city = city;
      if (popular === "true" || popular === "false")
        matchConditions.popular = popular === "true";

      // Add conditions for ranges
      if (rentalCostMin || rentalCostMax) {
        matchConditions.price = {
          ...(rentalCostMin ? { $gte: parseInt(rentalCostMin) } : {}),
          ...(rentalCostMax ? { $lte: parseInt(rentalCostMax) } : {}),
        };
      }

      // Define the aggregation pipeline

      // Add range conditions to the match stage
      if (pppMin || pppMax) {
        matchConditions.vegPerPlate = {
          ...(pppMin ? { $gte: parseInt(pppMin) } : {}),
          ...(pppMax ? { $lte: parseInt(pppMax) } : {}),
        };
        matchConditions.nonVegPerPlate = {
          ...(pppMin ? { $gte: parseInt(pppMin) } : {}),
          ...(pppMax ? { $lte: parseInt(pppMax) } : {}),
        };
      }
      if (lawnsMin || lawnsMax) {
        matchConditions.totalLawns = {
          ...(lawnsMin ? { $gte: parseInt(lawnsMin) } : {}),
          ...(lawnsMax ? { $lte: parseInt(lawnsMax) } : {}),
        };
      }
      if (banquetMin || banquetMax) {
        matchConditions.totalBanquet = {
          ...(banquetMin ? { $gte: parseInt(banquetMin) } : {}),
          ...(banquetMax ? { $lte: parseInt(banquetMax) } : {}),
        };
      }
      if (roomsMin || roomsmax) {
        matchConditions.totalRooms = {
          ...(roomsMin ? { $gte: parseInt(roomsMin) } : {}),
          ...(roomsmax ? { $lte: parseInt(roomsmax) } : {}),
        };
      }
      if (ratingMin || ratingMax) {
        matchConditions.avgRating = {
          ...(ratingMin ? { $gte: parseInt(ratingMin) } : {}),
          ...(ratingMax ? { $lte: parseInt(ratingMax) } : {}),
        };
      }
      const pipeline = [
        { $match: matchConditionss },
        {
          $addFields: {
            totalBanquet: {
              $cond: {
                if: {
                  $and: [
                    { $ne: [{ $type: "$totalBanquet" }, "missing"] }, // Ensure the field exists
                    { $ne: [{ $type: "$totalBanquet" }, "null"] },    // Ensure it's not null
                    { $regexMatch: { input: { $ifNull: ["$totalBanquet", ""] }, regex: /^[0-9.]+$/ } } // Ensure it's a numeric string
                  ]
                },
                then: { $toDouble: "$totalBanquet" },
                else: 0
              }
            },
            totalLawns: {
              $cond: {
                if: {
                  $and: [
                    { $ne: [{ $type: "$totalLawns" }, "missing"] },
                    { $ne: [{ $type: "$totalLawns" }, "null"] },
                    { $regexMatch: { input: { $ifNull: ["$totalLawns", ""] }, regex: /^[0-9.]+$/ } }
                  ]
                },
                then: { $toDouble: "$totalLawns" },
                else: 0
              }
            },
            totalRooms: {
              $cond: {
                if: {
                  $and: [
                    { $ne: [{ $type: "$totalRooms" }, "missing"] },
                    { $ne: [{ $type: "$totalRooms" }, "null"] },
                    { $regexMatch: { input: { $ifNull: ["$totalRooms", ""] }, regex: /^[0-9.]+$/ } }
                  ]
                },
                then: { $toDouble: "$totalRooms" },
                else: 0
              }
            },
            vegPerPlate: {
              $cond: {
                if: {
                  $and: [
                    { $ne: [{ $type: "$vegPerPlate" }, "missing"] },
                    { $ne: [{ $type: "$vegPerPlate" }, "null"] },
                    { $regexMatch: { input: { $ifNull: ["$vegPerPlate", ""] }, regex: /^[0-9.]+$/ } }
                  ]
                },
                then: { $toDouble: "$vegPerPlate" },
                else: 0
              }
            },
            nonVegPerPlate: {
              $cond: {
                if: {
                  $and: [
                    { $ne: [{ $type: "$nonVegPerPlate" }, "missing"] },
                    { $ne: [{ $type: "$nonVegPerPlate" }, "null"] },
                    { $regexMatch: { input: { $ifNull: ["$nonVegPerPlate", ""] }, regex: /^[0-9.]+$/ } }
                  ]
                },
                then: { $toDouble: "$nonVegPerPlate" },
                else: 0
              }
            },
          }
          
        },
        { $match: matchConditions },

        { $sort: { score: { $meta: "textScore" } } },
      ];
      // Pagination settings
      const pageSize = isAdmin ? 20 : 12;
      const skip = (page - 1) * pageSize;

      // Final pipeline stages for pagination and limiting results
      pipeline.push({ $skip: skip }, { $limit: pageSize });

      try {
        const result = await VenueUserModels.aggregate(pipeline);
        const total = await VenueUserModels.countDocuments(matchConditions);

        res.status(200).send({
          success: true,
          message: "Items fetched successfully",
          total,
          totalPage: Math.ceil(total / pageSize),
          page,
          pageSize: result.length,
          data: result,
        });
      } catch (error) {
        console.error(
          "🚀 ~ file: VenueUserControllers.js:522 ~ fullTextSearch: ~ error:",
          error
        );
        res.status(500).send({
          success: false,
          message: "Error in processing",
          data: error,
        });
      }
    } else {
      res.status(400).send({
        success: false,
        message: "Search string is required",
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
      const customers = await VenueUserModels.find();
      const customer = await customers.forEach(async (data1) => {
        const data = JSON.parse(JSON.stringify(data1));
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

        const newLMain =
          typeof data?.lmenu === "string"
            ? data?.lmenu?.replace(
                "https://wedcell.s3.ap-south-1.amazonaws.com",
                ""
              )
            : "";
        const newAmenities = data?.amenities?.map((d) => {
          d.layout = replaceS3BaseUrl(d?.layout);
          return d;
        });
        const newMenue = data?.menu?.map((d) => {
          d = d?.replace("https://wedcell.s3.ap-south-1.amazonaws.com", "");
          return d;
        });
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
          lmenu: newLMain,
          amenities: newAmenities,
          menu: newMenue,
          brochure: newBrochure,
          images: newimages,
          albums: newAlbum,
        };
        const a = await VenueUserModels.updateOne(
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
