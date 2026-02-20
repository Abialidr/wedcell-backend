const bcrypt = require("bcrypt");
var salt = "$2b$10$pm4WmosjwhVivTDHxkCoiO";
const CustomerModels = require("../models/CustomerModels");
const { otpValidationMobile } = require("../../otp/validation/OtpValidation");
const Otp = require("../../otp/models/OtpModal");
const {
  BudgetCategory,
  BudgetSubCategory,
} = require("../../budget/models/BudgetModel");
const PDFDocument = require("pdfkit-table");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const {
  GetOne,
  GetManyWithPagination,
  UpdateUser,
  GetMany,
  CreateUser,
  countDocuments,
  RefreshUser,
  DeleteUser,
} = require("../services/CustomerServices");
var config = require("../../../config/config");
var jwt = require("jsonwebtoken");
var TodoModel = require("../../todos/models/TodoModel");
const moment = require("moment");
const {
  defaultTodos,
  defaultMenues,
  categories,
  subcategories,
} = require("../../../lib/defaulVariables");
const GuestModel = require("../../guests/models/GuestModel");
const BudgetServices = require("../../budget/services/BudgetServices");
const messageModel = require("../../contact/models/messageModel");
const { replaceS3BaseUrl } = require("../../../utils");

module.exports = {
  CreateAccount: async (req, res) => {
    console.log(req.body);
    try {
      var rowData = req.body;
      const data = {};
      // data.password = rowData.password;
      // data.mobile = rowData.mobile;
      data.email = rowData.email;
      data.name = rowData.name;
      data.is_mobile_verified = true;
      data.weddingPersonal = {
        groomName: rowData.groomName,
        brideName: rowData.brideName,
        groomImage: replaceS3BaseUrl(req.files.groomImage[0].location),
        brideImage: replaceS3BaseUrl(req.files.brideImage[0].location),
        eventDate: rowData.eventDate,
        startTime: rowData.startTime,
        endTime: rowData.endTime,
      };
      data.todos = [
        "12 months before the wedding",
        "10 months before the wedding",
        "8 months before the wedding",
        "6 months before the wedding",
        "4 months before the wedding",
        "3 months before the wedding",
        "2 months before the wedding",
        "1 months before the wedding",
        "2 weeks before the wedding",
        "1 week before the wedding",
        "The day before the wedding",
        "The wedding day",
        "After the wedding",
      ];
      data.menu = defaultMenues;
      const defaultGuests = [
        `Couples`,
        `${rowData.groomName}'s colleagues`,
        `${rowData.brideName}'s colleagues`,
        `Mutual friends`,
        `${rowData.groomName}'s family`,
        `${rowData.brideName}'s family`,
        `${rowData.groomName}'s friends`,
        `${rowData.brideName}'s friends`,
      ];
      data.guest = defaultGuests;

      var condition = {
        _id: rowData.id,
      };
      let Customer = await GetOne(condition);
      Customer = await UpdateUser(data);
      const defaultTodosUpdatetd = defaultTodos.map((data) => {
        data.userId = Customer._id;
        data.dueDate = rowData.eventDate;
        return data;
      });
      const defaultBudgetSubCategoriesUpdatetd = subcategories.map((data) => {
        data.userId = Customer._id;
        return data;
      });
      categories.userId = Customer._id;
      const defaultInvites = [
        {
          userId: Customer._id,
          name: rowData.brideName,
          group: "Couples",
          menu: "Adult",
          attendence: "1",
          gender: "Female",
          inviteSent: true,
        },
        {
          userId: Customer._id,
          name: rowData.groomName,
          group: "Couples",
          menu: "Adult",
          attendence: "1",
          gender: "Male",
          inviteSent: true,
        },
      ];
      const Todos = await TodoModel.insertMany(defaultTodosUpdatetd);
      const Guests = await GuestModel.insertMany(defaultInvites);
      const BudgetCategories = await BudgetCategory.create(categories);
      const BudgetSubCategories = await BudgetSubCategory.insertMany(
        defaultBudgetSubCategoriesUpdatetd
      );
      if (Customer) {
        res.status(200).send({
          message: "Account created successfully",
          data: Customer,
          success: true,
          Todos,
          Guests,
          BudgetCategories,
          BudgetSubCategories,
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
  UserLogin: async function (req, res) {
    try {
      const { mobile, otp } = req.body;
      if (mobile) {
        await otpValidationMobile.validate({
          mobile,
        });
        let Customer = await GetOne({ mobile: mobile });
        let findedOtp = await Otp.findOne({ mobile: mobile });
        if (!findedOtp) {
          return res.status(404).send({
            success: false,
            error: {
              message: "otp expires",
            },
          });
        }

        console.log("🚀 ~ otp:", otp);
        // if (findedOtp.otp != otp || otp !== '123456') {1
        if (findedOtp.otp != otp) {
          // if (otp !== '123456') {
          return res.status(400).send({
            success: false,
            error: {
              message: "incorrect otp",
            },
          });
        }
        if (!Customer) {
          Customer = await CreateUser({ mobile: mobile });
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
            role: "User",
            lastLoggedIn: moment().format(),
          },
          config.secret
        );
        return res.status(200).send({
          message: "customer login successful",
          success: true,
          data: Customer,
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

    // data = req.body;
    // try {
    //   var condition = {
    //     $or: [{ mobile: data.me }, { email: data.me }],
    //   };
    //   let Customer = await GetMany(condition);
    //   if (Customer.length === 0) {
    //     return res.status(400).send({
    //       message: "user dont exist",
    //       success: false,
    //       data: [],
    //     });
    //   }
    //   const pwd = await bcrypt.hash(data.password, salt);
    //   // var pwd = cryptoJs.SHA256(data.password);
    //   data.password = pwd.toString();

    //   condition = {
    //     $or: [
    //       {
    //         $and: [{ mobile: data.me }, { password: data.password }],
    //       },
    //       {
    //         $and: [{ email: data.me }, { password: data.password }],
    //       },
    //     ],
    //   };
    //   Customer = await GetMany(condition);
    //   if (Customer.length > 0) {
    //     Customer = RefreshUser(Customer[0]);

    //     Customer.token = jwt.sign(
    //       {
    //         _id: Customer.id,
    //         role: "User",
    //         lastLoggedIn: moment().format(),
    //       },
    //       config.secret
    //     );

    //     return res.status(200).send({
    //       message: "customer login successful",
    //       success: true,
    //       data: Customer,
    //     });
    //   } else {
    //     return res.status(400).send({
    //       message: "invalid id or password",
    //       success: false,
    //       data: [],
    //     });
    //   }
    // } catch (error) {
    //   console.error(`🚀 ~ file: CustomerControllers.js:122 ~ error:`, error);
    //   res.status(400).send({
    //     message: "Something went wrong",
    //     error: JSON.stringify(error),
    //     data: [],
    //     success: false,
    //   });
    // }
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
  UpdateWeddingPersonal: async function (req, res) {
    try {
      var rowData = req.body;
      const condition = { _id: req.user._id },
        data = {};

      data.is_mobile_verified = true;
      data.weddingPersonal = {
        groomName: rowData.groomName,
        brideName: rowData.brideName,
        groomImage:
          req.files.groomImage !== undefined
            ? replaceS3BaseUrl(req.files.groomImage[0].location)
            : rowData.groomImageOld,
        brideImage:
          req.files.brideImage !== undefined
            ? replaceS3BaseUrl(req.files.brideImage[0].location)
            : rowData.brideImageOld,
        eventDate: rowData.eventDate,
        startTime: rowData.startTime,
        endTime: rowData.endTime,
      };
      if (rowData.email) {
        data.email = rowData.email;
        data.name = rowData.name;
        data.todos = [
          "12 months before the wedding",
          "10 months before the wedding",
          "8 months before the wedding",
          "6 months before the wedding",
          "4 months before the wedding",
          "3 months before the wedding",
          "2 months before the wedding",
          "1 months before the wedding",
          "2 weeks before the wedding",
          "1 week before the wedding",
          "The day before the wedding",
          "The wedding day",
          "After the wedding",
        ];
        data.menu = defaultMenues;
        const defaultGuests = [
          `Couples`,
          `${rowData.groomName}'s colleagues`,
          `${rowData.brideName}'s colleagues`,
          `Mutual friends`,
          `${rowData.groomName}'s family`,
          `${rowData.brideName}'s family`,
          `${rowData.groomName}'s friends`,
          `${rowData.brideName}'s friends`,
        ];
        data.guest = defaultGuests;
      }
      let Customer = await UpdateUser(condition, data);
      if (rowData.email) {
        const defaultTodosUpdatetd = defaultTodos.map((data) => {
          data.userId = Customer._id;
          data.dueDate = rowData.eventDate;
          return data;
        });
        const defaultBudgetSubCategoriesUpdatetd = subcategories.map((data) => {
          data.userId = Customer._id;
          return data;
        });
        categories.userId = Customer._id;
        const defaultInvites = [
          {
            userId: Customer._id,
            name: rowData.brideName,
            group: "Couples",
            menu: "Adult",
            attendence: "1",
            gender: "Female",
            inviteSent: true,
          },
          {
            userId: Customer._id,
            name: rowData.groomName,
            group: "Couples",
            menu: "Adult",
            attendence: "1",
            gender: "Male",
            inviteSent: true,
          },
        ];
        const Todos = await TodoModel.insertMany(defaultTodosUpdatetd);
        const Guests = await GuestModel.insertMany(defaultInvites);
        const BudgetCategories = await BudgetCategory.create(categories);
        const BudgetSubCategories = await BudgetSubCategory.insertMany(
          defaultBudgetSubCategoriesUpdatetd
        );
      }
      if (Customer) {
        res.status(200).send({
          message: "Wedding details Updated successfully",
          data: Customer,
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

        if (findedOtp.otp != otp) {
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
    console.log(`🚀 ~ file: CustomerControllers.js:518 ~ req.body:`, req.body);
    try {
      let conditions;
      let data = {
        ...req.body,
        _id: req.body._id,
        is_delete: req.body.is_delete,
      };

      if (Object.hasOwnProperty.bind(req.body)("is_delete")) {
        conditions = {
          _id: req.body._id,
        };
        // data = {
        //   is_delete: req.body.is_delete,
        // };
      } else {
        conditions = {
          _id: req.user._id,
        };
        typeof req.body.data === "string"
          ? JSON.parse(req.body.data)
          : req.body;
        let coverLink = req.body.coverlink
          ? JSON.parse(req.body.coverlink)
          : [];
        coverLink = coverLink.length ? coverLink : [];
        const findedUser = await GetOne(conditions);

        if (findedUser.mobile !== req.body.mobile) {
          data.is_mobile_verified = false;
        } else {
          data.is_mobile_verified = true;
          data.is_approved = true;
        }
        if (findedUser.email !== req.body.email) {
          data.is_email_verified = false;
        } else {
          data.is_email_verified = true;
          data.is_approved = true;
        }

        let cover_pic = req.files?.cover
          ? req.files?.cover.map((item) => replaceS3BaseUrl(item.location))
          : [];
        cover_pic = [...cover_pic, ...coverLink];

        const profile_pic = req.body.profilelink
          ? req.body.profilelink
          : req.files?.profile
          ? replaceS3BaseUrl(req.files?.profile[0].location)
          : "";

        data.cover_pic = cover_pic;
        data.profile_pic = profile_pic;
      }

      const message = data.is_approved ? "User Verified" : "User not verified";

      const user_data = await UpdateUser(conditions, data);
      console.log(
        "🚀 ~ file: CustomerControllers.js:563 ~ user_data:",
        user_data
      );
      const Customer = RefreshUser(user_data);

      res.status(200).send({
        data: Customer,
        success: true,
        message,
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
  UpdateCoverPic: async function (req, res) {
    try {
      const conditions = {
        _id: req.user._id,
      };
      let coverLink = req.body.coverlink ? JSON.parse(req.body.coverlink) : [];
      const data = {};
      let cover_pic = req.files?.cover
        ? req.files?.cover.map((item) => replaceS3BaseUrl(item.location))
        : [];

      data.cover_pic = [...cover_pic, ...coverLink];

      const user_data = await UpdateUser(conditions, data);

      const Customer = RefreshUser(user_data);

      res.status(200).send({
        data: Customer,
        success: true,
        message: "user updated sucessfully",
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
  updateTGM: async function (req, res) {
    try {
      const data = req.body;
      const condition = {
        _id: req.user._id,
      };
      let Customer = await UpdateUser(condition, data);
      Customer = RefreshUser(Customer);
      res.status(200).send({
        message: "Updated Succesfully",
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
  deleteTGM: async function (req, res) {
    try {
      const data = {};

      if (Object.hasOwnProperty.bind(req.body)("todos")) {
        data.todos = req.body.todos;

        const condition = {
          userId: req.user._id,
          category: req.body.category,
        };
        await TodoModel.deleteMany(condition);
      }
      if (Object.hasOwnProperty.bind(req.body)("menu")) {
        data.menu = req.body.menu;
        const condition = {
          userId: req.user._id,
          menu: req.body.category,
        };
        const deleted = await GuestModel.deleteMany(condition);
      }
      if (Object.hasOwnProperty.bind(req.body)("guest")) {
        data.guest = req.body.guest;
        const condition = {
          userId: req.user._id,
          group: req.body.category,
        };
        await GuestModel.deleteMany(condition);
      }
      if (Object.hasOwnProperty.bind(req.body)("family")) {
        data.family = req.body.family;
        const condition = {
          userId: req.user._id,
          family: req.body.category,
        };
        await GuestModel.deleteMany(condition);
      }
      const condition = {
        _id: req.user._id,
      };
      let Customer = await UpdateUser(condition, data);
      Customer = RefreshUser(Customer);
      return res.status(200).send({
        message: "Updated Succesfully",
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
  fullTextSearch: async (req, res) => {
    try {
      const searchString = req.params.id;
      if (searchString) {
        try {
          const result = await CustomerModels.find(
            {
              $text: { $search: searchString },
            },
            { score: { $meta: "textScore" } }
          )
            .sort({ score: { $meta: "textScore" } })
            .skip((parseInt(req.query.page) - 1) * 20)
            .limit(20);

          const total = await CustomerModels.countDocuments({
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
          console.log(
            "🚀 ~ file: CustomerControllers.js:721 ~ fullTextSearch: ~ error:",
            error
          );

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

  DeleteOneUser: function (req, res) {
    let condition = {
      _id: req.user._id,
    };
    console.log("🚀 ~ condition.req.user._id:", req.user._id);
    DeleteUser(condition)
      .then(function (result) {
        console.log("🚀 ~ result:", result);
        return res.status(200).send({
          success: true,
          message: "User Deleted Successfully",
        });
      })
      .catch(function (error) {
        return res.status(400).send({
          success: false,
          message: "User Deleted unsuccessfully",
        });
      });
  },

  // //-----------Forget Password------------------

  // updateall: async function (req, res) {
  //   const result = await UserModels.find();
  //   const resss = await result.map(async (item, index) => {
  //     const data = {
  //       password:
  //         '$2b$10$pm4WmosjwhVivTDHxkCoiOPN.UzkfldGa124PofDi.GM8DDZoWQne',
  //     };
  //     const updateRes = await UserModels.findOneAndUpdate(
  //       { _id: item._id },
  //       { $set: data },
  //       { useFindAndModify: false, new: true }
  //     );
  //     return updateRes;
  //   });
  //   res.send({
  //     success: true,
  //     data: await Promise.all(resss),
  //   });
  // },
  createPdf: async function (req, res) {
    try {
      console.log(req.body);
      const data = req.body;
      let arr = [];
      for (const category of data.categories) {
        // console.log(category.id);
        const condition = {
          userId: req.user._id,
          category_id: category.id,
        };
        const data1 = await BudgetServices.GetOneSubCategory(condition);
        arr.push(data1);
        // console.log(data1);
      }

      const user = await CustomerModels.findById(req.user._id);

      const buffers = [];
      const logoPath = path.join(__dirname, "wedcell.png");
      // Create a PDF document
      let doc = new PDFDocument({ margin: 30, size: "A4" });
      // save document
      doc.on("data", (chunk) => {
        buffers.push(chunk);
      });

      // Handle the 'end' event to send the PDF response
      doc.on("end", () => {
        const pdfBuffer = Buffer.concat(buffers);
        const pdfBase64 = pdfBuffer.toString("base64");
        console.log(pdfBase64);
        res.json({ success: true, pdfBase64: pdfBase64 });
      });
      (async function () {
        let yPosition = 200;

        for (let i = 0; i < arr.length; i++) {
          // console.log(arr[i])
          let subArr = [];
          arr[i].subcategory.forEach(async (e) => {
            const subcategory = e;
            const estimatedAmount = subcategory.estimated_amount || 0;
            const finalCost = subcategory.final_cost || 0;
            const paidAmount = subcategory.paid_amount || 0;

            subArr.push([
              subcategory.subcategory_name,
              estimatedAmount,
              finalCost,
              paidAmount,
            ]);
          });
          // console.log(subArr)
          const table = {
            title: arr[i].category_name,
            // subtitle: "Subtitle",
            headers: [
              "subcategory_name",
              "estimated_amount",
              "final_cost",
              "paid_amount",
              // "percentage",
            ],
            rows: subArr,
          };
          i == 0 &&
            doc.fontSize(20).text("Budget Estimate", { align: "center" });

          await doc.table(table, {
            columnsSize: [150, 150, 150, 150],
          });
          await doc.moveDown();
          await doc
            .fontSize(8)
            .text(`Total amount: ${arr[i].total_estimated_amount}`);
          await doc.fontSize(8).text(`Final cost: ${arr[i].total_final_cost}`);
          await doc
            .fontSize(8)
            .text(`Total paid amount: ${arr[i].total_paid_amount}`);
          await doc.moveDown();
        }

        doc.moveDown();
        await doc
          .fontSize(16)
          .text(`Total amount: ${data.total_estimated_amount}`);
        await doc.fontSize(16).text(`Final cost: ${data.total_final_cost}`);
        await doc
          .fontSize(16)
          .text(`Total paid amount: ${data.total_paid_amount}`);
        doc.moveDown();
        doc
          .fontSize(10)
          .text("Thank you for choosing wedfield", { align: "center" });

        doc.end();
      })();
    } catch (error) {
      console.error("Error generating invoice:", error);
      res.send({ success: false });
    }
  },
};
