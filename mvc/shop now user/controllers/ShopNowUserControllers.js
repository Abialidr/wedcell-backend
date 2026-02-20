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
} = require("../services/ShopNowUserServices");
var config = require("../../../config/config");
var jwt = require("jsonwebtoken");
const moment = require("moment");
const {
  create_warehouse,
  update_warehouse,
} = require("../../delhivery/service/delhiveryService");
var ShopNowUserModels = require("../models/ShopNowUserModels");
const messageModel = require("../../contact/models/messageModel");
const { replaceS3BaseUrl } = require("../../../utils");

module.exports = {
  CreateAccount: async (req, res) => {
    try {
      var rowData = req.body;
      const data = {};
      data.name = rowData.name;
      data.company_name = rowData.company_name;
      data.email = rowData.email;
      data.company_address = rowData.company_address;
      data.categories = rowData.categories;
      data.warehouse_address = {
        pincode: rowData.pincode,
        city: rowData.city,
        state: rowData.state,
        country: rowData.country,
        address1: rowData.address1,
        address2: rowData.address2,
        landmark: rowData.landmark,
      };
      data.cover_pic = req.files.cover_pic.map((data) => {
        return replaceS3BaseUrl(data.location);
      });
      data.profile_pic = replaceS3BaseUrl(req.files.profile_pic[0].location);
      data.is_mobile_verified = true;
      data.is_email_verified = false;
      var condition = {
        _id: req.body?.id,
      };
      Customer = await UpdateUser(condition, data);
      console.log(Customer);
      res.status(200).send({
        message: "Account created successfully",
        data: Customer,
        success: true,
      });
      // if (Customer) {
      //   const createresp = await create_warehouse({
      //     phone: rowData.mobile,
      //     city: rowData.city,
      //     name: rowData.name + rowData.pincode.toString(),
      //     pin: rowData.pincode,
      //     address: rowData.address1 + rowData.address2,
      //     country: rowData.country,
      //     email: rowData.email,
      //     registered_name: rowData.name + rowData.pincode.toString(),
      //     return_address: rowData.address1 + rowData.address2,
      //     return_pin: rowData.pincode,
      //     return_city: rowData.city,
      //     return_state: rowData.state,
      //     return_country: rowData.country,
      //   });
      //   if (!createresp.success) {
      //     res.status(400).send({
      //       error: { message: "Please add valid credentials" },
      //     });
      //   }
      // }
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
  UserLogin: async function (req, res) {
    data = req.body;
    try {
      var condition = {
        $or: [{ mobile: data.me }, { email: data.me }],
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
        return res.status(400).send({
          success: false,
          error: {
            message: "incorrect otp",
          },
        });
      }
      if (!Customer) {
        Customer = await CreateUser({ mobile: data.me });
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
          role: "ShopNow",
          lastLoggedIn: moment().format(),
        },
        config.secret
      );

      return res.status(200).send({
        message: "customer login successful",
        success: true,
        data: Customer,
        role: "ShopNow",
      });
    } catch (error) {
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
  GetUser: async function (req, res) {
    try {
      let condition;
      if (req.query.isAdmin) {
        condition = {};
      } else {
        condition = {
          is_delete: false,
          is_approved: true,
        };
      }
      const Customer = await GetManyWithPagination(condition, req.params.id);

      const total = await countDocuments(condition);
      if (Customer.length > 0) {
        return res.status(200).send({
          data: Customer,
          total,
          totalPage: Math.ceil(total / 20),
          page: req.params.page,
          pageSize: Customer.length,
          message: "Customer fetched successfully",
          success: true,
        });
      } else {
        return res.status(200).send({
          data: [],
          message: "no Customer Found",
          success: false,
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
  GetUserById: async function (req, res) {
    try {
      let condition = {
        is_delete: false,
        _id: req.params.id,
      };
      const Customer = await GetMany(condition);
      if (Customer.length > 0) {
        return res.status(200).send({
          data: Customer,
          message: "Customer fetched successfully",
          success: true,
        });
      } else {
        return res.status(200).send({
          data: [],
          message: "no Customer Found",
          success: false,
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
        mobile: mobile,
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

        let isMobile = await GetOne({ mobile: mobile });
        if (!isMobile) {
          return res.status(404).send({
            success: false,
            error: {
              message: "no mobile found",
            },
          });
        }
        let findedOtp = await Otp.findOne({ mobile: mobile });

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
          mobile: mobile,
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
  updateUser: async function (req, res) {
    try {
      let conditions;
      let data, response;
      if (Object.hasOwnProperty.bind(req.body)("is_delete")) {
        conditions = {
          _id: req.body._id,
        };
        data = {
          is_delete: req.body.is_delete,
        };
      } else {
        conditions = {
          _id: req.user._id,
        };
        data = JSON.parse(req.body.data);
        let coverLink = req.body.coverlink
          ? JSON.parse(req.body.coverlink)
          : [];
        coverLink = coverLink.length ? coverLink : [];
        const findedUser = await GetOne(conditions);

        if (findedUser.mobile !== data.mobile) {
          data.is_mobile_verified = false;
        } else {
          data.is_mobile_verified = true;
          data.is_approved = true;
        }
        if (findedUser.email !== data.email) {
          data.is_email_verified = false;
        } else {
          data.is_email_verified = true;
          data.is_approved = true;
        }
        console.log(1);
        let cover_pic = req.files?.cover
          ? req.files?.cover.map((item) => replaceS3BaseUrl(item.location))
          : [];
        cover_pic = [...cover_pic, ...coverLink];
        console.log(11);

        const profile_pic = req.body.profilelink
          ? req.body.profilelink
          : req.files?.profile
          ? replaceS3BaseUrl(req.files?.profile[0].location)
          : "";

        data.cover_pic = cover_pic;
        data.profile_pic = profile_pic;
        response = await update_warehouse({
          phone: data.mobile,
          name: data.name + data.warehouse_address[0].pincode.toString(),
          pin: data.warehouse_address[0].pincode,
          address:
            data.warehouse_address[0].address1 +
            data.warehouse_address[0].address2,
          registered_name:
            data.name + data.warehouse_address[0].pincode.toString(),
        });
      }

      const message = data.is_approved ? "User Verified" : "User not verified";

      const user_data = await UpdateUser(conditions, data);
      const Customer = RefreshUser(user_data);

      if (Customer) {
        console.log("create new");
        res.status(200).send({
          data: Customer,
          success: true,
          role: "ShopNow",
          message,
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
  fullTextSearch: async (req, res) => {
    try {
      const searchString = req.params.id;
      if (searchString) {
        try {
          const result = await ShopNowUserModels.find(
            {
              $text: { $search: searchString },
            },
            { score: { $meta: "textScore" } }
          )
            .sort({ score: { $meta: "textScore" } })
            .skip((parseInt(req.query.page) - 1) * 20)
            .limit(20);

          const total = await ShopNowUserModels.countDocuments({
            $text: { $search: searchString },
          });
          res.status(200).send({
            success: true,
            message: "Items Gets Successfully",
            total,
            totalPage: Math.ceil(total / 20),
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
  DeleteUser: function (req, res) {
    let data = {
      is_delete: true,
    };
    let condition = {
      _id: req.body._id,
    };
    UsersServices.DeleteUser(condition, data)
      .then(function (result) {
        return res.json(result);
      })
      .catch(function (error) {
        return res.json(error);
      });
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
  updateall: async function (req, res) {
    try {
      const customers = await ShopNowUserModels.find();
      const customer = await customers.forEach(async (data1) => {
        const data = JSON.parse(JSON.stringify(data1));
        let newMain = "";
        if (
          (data?.profile_pic && data.profile_pic !== undefined) ||
          data.profile_pic !== null
        ) {
          newMain = data?.profile_pic?.replace(
            "https://wedcell.s3.ap-south-1.amazonaws.com",
            ""
          );
        }
        const newimages = data?.cover_pic?.map((d) => {
          d = d?.replace("https://wedcell.s3.ap-south-1.amazonaws.com", "");
          return d;
        });
        const w = {
          profile_pic: newMain,
          cover_pic: newimages,
        };
        const a = await ShopNowUserModels.updateOne(
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
