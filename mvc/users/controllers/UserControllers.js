var UsersServices = require("../services/UserServices");
var UtilsService = require("../../utils/services/UtilsServices");
var config = require("../../../config/config");
var nodemailer = require("nodemailer");
var otpGenerator = require("otp-generator");
const { async } = require("q");
const axios = require("axios");
const bcrypt = require("bcrypt");
var salt = "$2b$10$pm4WmosjwhVivTDHxkCoiO";
var UserModels = require("../models/UserModels");
const { replaceS3BaseUrl } = require("../../../utils");

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "",
    pass: "",
  },
});

var transporterMailtrap = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

module.exports = {
  GetUser: function (req, res) {
    let condition = {
      is_delete: false,
      role: req.body.role,
    };
    console.log(condition);
    UsersServices.GetUser(condition)
      .then(function (result) {
        return res.status(200).json(result);
      })
      .catch(function (error) {
        console.error(error, "  - - - error = ");
        return res.status(500).json(error);
      });
  },

  createPaymetIntent: async (req, res) => {
    let condition = {
      is_delete: false,
      _id: req.body._id,
    };
    UsersServices.GetUser(condition)
      .then(async (result) => {
        const User = result.data[0]._doc;
        if (User.stripeCustomer) {
          const setupIntent = await stripe.setupIntents.create({
            customer: User.stripeCustomer.id,
          });
          const clientSecret = setupIntent.client_secret;
          const data = { clientSecret };
          var resp = {
            success: true,
            message: "Client Secret added",
            data: data,
          };
          res.send(resp);
        } else {
          const stripeCustomer = await stripe.customers.create();
          const setupIntent = await stripe.setupIntents.create({
            customer: stripeCustomer.id,
          });
          const clientSecret = setupIntent.client_secret;
          const data = { clientSecret };

          var resp = {
            success: true,
            message: "Client Secret added",
            data: data,
          };
          const data1 = { stripeCustomer: stripeCustomer };
          UsersServices.UpdateUser(condition, data1).then((res) => { });
          res.send(resp);
        }
      })
      .catch(function (error) {
        console.error(error, "  - - - error = ");
        return res.json(error);
      });
  },

  ValidatePhone: (req, res) => {
    var condition = {
      mobile: req.body.mobile,
    };
    UsersServices.GetUser(condition)
      .then(async (result) => {
        if (result.data.length > 0) {
          var resp = {
            success: false,
            message: "Phone Already used",
            data: [],
          };
          res.send(resp);
        } else {
          var resp = {
            success: true,
            message: "No accounts with this Phone No.",
            data: [],
          };
          res.send(resp);
        }
      })
      .catch((e) => {
        console.error(e, "  - - - error = ");
        return res.json(e);
      });
  },

  GetUserById: function (req, res) {
    let condition = {
      is_delete: false,
      _id: req.body._id,
    };
    UsersServices.GetUser(condition)
      .then(function (result) {
        return res.json(result);
      })
      .catch(function (error) {
        console.error(error, "  - - - error = ");
        return res.json(error);
      });
  },

  UpdateUser: async function (req, res) {
    try {
      const data =
        typeof req.body.data === "string"
          ? JSON.parse(req.body.data)
          : req.body;
      let coverLink = req.body.coverlink
        ? JSON.parse(req.body.coverlink)
        : [""];
      coverLink = coverLink.length ? coverLink : [];
      const findedUser = await UserModels.findById(req.user._id);

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

      let cover_pic = count?.cover
        ? count?.cover.map((item) => replaceS3BaseUrl(item.location))
        : [];
      cover_pic = [...cover_pic, ...coverLink];

      const profile_pic = req.body.profilelink
        ? req.body.profilelink
        : count?.profile
          ? replaceS3BaseUrl(count?.profile[0].location)
          : "";

      data.cover_pic = cover_pic;
      data.profile_pic = profile_pic;

      const message = data.is_approved ? "User Verified" : "User not verified";

      const user_data = await UserModels.findByIdAndUpdate(req.user._id, data, {
        new: true,
      });

      var new_user_obj = {
        name: user_data.name,
        company_name: user_data.company_name,
        mobile: user_data.mobile,
        email: user_data.email,
        city: user_data.city,
        state: user_data.state,
        country: user_data.country,
        address1: user_data.address1,
        address2: user_data.address2,
        landmark: user_data.landmark,
        shipping_address: user_data.shipping_address,
        pincode: user_data.pincode,
        profile_pic: user_data.profile_pic,
        cover_pic: user_data.cover_pic,
        document_images: [],
        is_email_verified: user_data.is_email_verified,
        is_mobile_verified: user_data.is_mobile_verified,
        is_both_address_same: user_data.is_both_address_same,
        is_approved: user_data.is_approved,
        is_delete: user_data.is_delete,
        stripeCustomer: user_data.stripeCustomer,
        notificationList: user_data.notificationList,
        role: user_data.role,
        _id: user_data._id,
      };

      res.status(200).send({
        data: new_user_obj,
        success: true,
        message,
      });
    } catch (error) {
      console.error(`🚀 ~ file: UserControllers.js:187 ~ error:`, error);
      res.status(400).send({
        error,
      });
    }
  },

  UpdateWithPass: async (req, res) => {
    var data = req.body;
    const currentPassword = await bcrypt.hash(data.currentPassword, salt);
    const user = await UserModels.findById(req.body._id);
    if (currentPassword === user.password) {
      // const salt = await bcrypt.genSalt(10);
      const pwd = await bcrypt.hash(data.password, salt);
      // var pwd = cryptoJs.SHA256(data.password);
      data.password = pwd;
      // data.salt=salt;
      let condition = {
        _id: req.body._id,
      };
      UsersServices.UpdateUser(condition, data)
        .then(function (result) {
          return res.json(result);
        })
        .catch(function (error) {
          console.error(error, "  - - - error = ");
          return res.json(error);
        });
    } else {
      res.status(400).send({
        success: false,
        message: "password doesnt match",
      });
    }
  },

  UpdatePassByAdmin: async (req, res) => {
    var data = req.body;
    // const salt = await bcrypt.genSalt(10);
    const pwd = await bcrypt.hash(data.password, salt);
    // var pwd = cryptoJs.SHA256(data.password);
    data.password = pwd;
    // data.salt=salt;
    let condition = {
      _id: req.body._id,
    };
    UsersServices.UpdateUser(condition, data)
      .then(function (result) {
        return res.json(result);
      })
      .catch(function (error) {
        console.error(error, "  - - - error = ");
        return res.json(error);
      });
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
        console.error(error, "  - - - error = ");
        return res.json(error);
      });
  },

  CreateAccount: async (req, res) => {
    var data = req.body;
    // const salt = await bcrypt.genSalt(10);
    const pwd = await bcrypt.hash(data.password, salt);
    // var pwd = cryptoJs.SHA256(data.password);
    data.password = pwd.toString();
    // data.salt=salt;
    var condition = {
      $or: [{ mobile: data.mobile }, { email: data.email }],
    };

    UsersServices.GetUser(condition).then(async (result) => {
      if (result.data.length > 0) {
        var resp = {
          success: false,
          message: "Phone Number or Email Already Used",
          data: [],
        };
        res.json(resp.message);
      } else {
        // const stripeCustomer = await stripe.customers.create();
        const newdata = { ...data };

        UsersServices.CreateAccount(newdata)
          .then(function (result) {
            const { data } = result;
            UsersServices.GenerateToken(data._id, data.role).then(function (
              token
            ) {
              var new_user_obj = {
                _id: data._id,
                name: data.name,
                email: data.email,
                token: token,
                is_mobile_verified: data.is_mobile_verified,
                is_both_address_same: data.is_both_address_same,
                is_approved: data.is_approved,
                is_delete: data.is_delete,
                is_email_verified: data.is_email_verified,
                role: data.role,
                document_images: [],
                profile_pic: data.profile_pic,
                mobile: data.mobile,
                address1: data.address1,
                address2: data.address2,
                landmark: data.landmark,
                shipping_address: data.shipping_address,
                pincode: data.pincode,
                stripeCustomer: data.stripeCustomer,
                notificationList: data.notificationList,
                device_token: data.device_token,
              };
              var resp = {
                success: true,
                message: "User Registerd SuccessFully",
                data: new_user_obj,
              };
              return res.status(201).json(resp);
            });
          })
          .catch(function (error) {
            return res.status(500).json(error);
          });
      }
    });
  },

  // Kindly use this API for ADmin Login Only
  AdminLogin: function (req, res) {
    var data = req.body;
    var condition = {
      is_delete: false,
      $or: [{ name: data.email }, { email: data.email }],
      $or: [{ role: "shopkeeper" }, { role: "admin" }],
    };
    UsersServices.GetUser(condition)
      .then(function (result) {
        const temp = result.data;
        result.data = [];
        result.data.push(temp.find((obj) => obj.email === data.email));
        if (result.data.length > 0) {
          return UsersServices.ValidateLoggedInUser(result.data, data);
        } else {
          return UtilsService.ErrorResp([], "User does not exist");
        }
      })
      .then(function (validate_result) {
        // req.session.user = validate_result.data;
        return res.json(validate_result);
      })
      .catch(function (error) {
        console.error(error, "  - - - error = ");
        return res.json(error);
      });
  },

  UserLogin: async function (req, res) {
    try {
      var data = req.body;
      var condition = {
        is_delete: false,
        $or: [{ mobile: data.mobile }, { email: data.email }],
        role: req.body.role,
      };
      const result = await UsersServices.GetUser(condition);
      if (result.data.length > 0) {
        const validate_result = await UsersServices.ValidateLoggedInUser(
          result.data,
          data
        );
        return res.json(validate_result);
      } else {
        // return UtilsService.ErrorResp([], "User does not exist");
        return res.json("User does not exist");
      }
    } catch (error) {
      console.error(error, "  - - - error = ");
      return res.json(error);
    }
  },

  // IsSession: function (req, res) {
  //   var token = req.headers.token;
  //   if (req.session.user && req.session.user.token == token) {
  //     var user = req.session.user;
  //     var condition = {
  //       _id: user._id,
  //     };
  //     UsersServices.GetUser(condition)
  //       .then(function (result) {
  //         if (result.data.length > 0) {
  //           var user_data = result.data[0];
  //           var new_user_obj = {
  //             _id: user_data._id,
  //             name: user_data.name,
  //             email: user_data.email,
  //             token: token,
  //             is_mobile_verified: user_data.is_mobile_verified,
  //             is_both_address_same: user_data.is_both_address_same,
  //             is_approved: user_data.is_approved,
  //             is_delete: user_data.is_delete,
  //             is_email_verified: user_data.is_email_verified,
  //             role: user_data.role,
  //             document_images: [],
  //             profile_pic: [],
  //             mobile: user_data.mobile,
  //           };
  //           req.session.user = new_user_obj;
  //           var resp = {
  //             success: true,
  //             message: "Session Exist",
  //             data: new_user_obj,
  //           };
  //           return res.json(resp);
  //         } else {
  //           return UtilsService.ErrorResp([], "User does not exist");
  //         }
  //       })
  //       .catch(function (error) {
  //         return res.json(error);
  //       });
  //   } else {
  //     var resp = {
  //       success: false,
  //       message: "Token expired",
  //       data: "",
  //     };
  //     return res.json(resp);
  //   }
  // },

  ResetPasswordPhone: async (req, res) => {
    const data = req.body;
    // const salt = await bcrypt.genSalt(10);
    const pwd = await bcrypt.hash(data.password, salt);
    // var pwd = cryptoJs.SHA256(data.password);
    data.password = pwd;
    // data.salt = salt;
    let phone = data.phone.replace(/\s/g, "");
    if (phone.length > 10) {
      phone = phone.slice(phone.length - 10, phone.length);
    }
    var condition = {
      is_delete: false,
      mobile: { $regex: phone, $options: "i" },
    };
    UsersServices.GetUser(condition)
      .then(function (result) {
        if (result.data.length > 0) {
          const Userdata = result.data[0];
          updatedata = { password: data.password };
          UsersServices.UpdateUser(condition, updatedata)
            .then(function (result) {
              return res.json(result);
            })
            .catch(function (error) {
              console.error(error, "  - - - error = ");
              return res.json(error);
            });
        } else {
          return UtilsService.ErrorResp([], "User does not exist");
        }
      })
      .catch(function (error) {
        console.error(error, "  - - - error = ");
        return res.json(error);
      });
  },

  VerifyOTP: async (req, res) => {
    const data = req.body;
    // const salt = await bcrypt.genSalt(10);
    const pwd = await bcrypt.hash(data.password, salt);
    // var pwd = cryptoJs.SHA256(data.password);
    data.password = pwd;
    var condition = {
      is_delete: false,
      $or: [{ name: data.email }, { email: data.email }],
    };
    UsersServices.GetUser(condition)
      .then(function (result) {
        if (result.data.length > 0) {
          const Userdata = result.data[0];

          if (Userdata.mobileotp === data.otp) {
            updatedata = { ...data, otp: "", mobileotp: "" };

            UsersServices.UpdateUser(condition, updatedata)
              .then(function (result) {
                return res.json(result);
              })
              .catch(function (error) {
                console.error(error, "  - - - error = ");
                return res.json(error);
              });
          } else {
            var resp = {
              success: false,
              message: "OTP didn't matched",
              data: "",
            };
            return res.json(resp);
          }
        } else {
          return UtilsService.ErrorResp([], "User does not exist");
        }
      })
      .catch(function (error) {
        console.error(error, "  - - - error = ");
        return res.json(error);
      });
  },

  SendOTP: (req, res) => {
    const OTP = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    var url =
      "http://makemysms.in/api/sendsms.php?username=wedcell&password=01679b59&sender=WEDCEL" +
      "&mobile=" +
      req.body.mobile +
      "&type=1&product=1&template=1707163853590237508" +
      "&message=Your OTP for logging in to Wedcell account is " +
      OTP +
      ". OTP is valid till 5 min. Do not share with anyone.";
    axios
      .post(url)
      .then((data) => {
        res.json({
          status: 200,
          success: true,
          otp: OTP,
          message: "otp has been sent on your mobile.",
        });
      })
      .catch((e) => console.error(e));
  },

  ResetPasswordOTP: async (req, res) => {
    var data = req.body;
    var condition = {
      is_delete: false,
      $or: [{ name: data.email }, { email: data.email }],
    };
    const OTP = otpGenerator.generate(6, {
      upperCase: false,
      alphabets: false,
      specialChars: false,
    });

    var mailOptions = {
      from: "mtest2702@gmail.com",
      to: data.email,
      subject: "OTP Reset Password for send me box app",
      html: `Dear Customer Here is your OTP for Reset Password : <b>${OTP} </b>`,
    };
    const updatedata = { mobileotp: OTP };
    UsersServices.UpdateUser(condition, updatedata)
      .then(function (result) {
        transporterMailtrap.sendMail(mailOptions, function (error, response) {
          if (error) {
            var resp = {
              success: false,
              message: "Error in procesing",
              data: error,
            };
            res.status(500).send(resp);
            return;
          } else {
            var resp = {
              success: true,
              message: "Mail Sent Successfully",
              data: data,
            };
            res.status(200).send(resp);
            return;
          }
        });
      })
      .catch((error) => {
        console.error(error, "  - - - error = ");
        return res.json(error);
      });
  },

  ResetPassword: async (req, res) => {
    var data = req.body;
    // const salt = await bcrypt.genSalt(10);
    const pwd = await bcrypt.hash(data.password, salt);
    // var pwd = cryptoJs.SHA256(data.password);
    // data.password = pwd.toString();
    data.password = pwd;
    var condition = {
      is_token: data.token,
    };
    UsersServices.GetUser(condition)
      .then(function (result) {
        if (result.data.length > 0) {
          delete data.c_password;
          data.is_token = "";
          return UsersServices.UpdateUser(condition, data);
        } else {
          return UtilsService.ErrorResp([], "Link Already Used");
        }
      })
      .then(function (Updated_result) {
        Updated_result.message = " Password Reset Successfully";
        return res.json(Updated_result);
      })
      .catch(function (error) {
        console.error(error, "  - - - error = ");
        return res.json(error);
      });
  },

  GetShopkeeper: function (req, res) {
    var condition = {
      role: "shopkeeper",
    };
    UsersServices.GetUser(condition)
      .then(function (result) {
        return res.json(result);
      })
      .catch(function (error) {
        console.error(error, "  - - - error = ");
        return res.json(error);
      });
  },

  ChangeUserStatus: function (req, res) {
    var condition = {
      _id: req.body._id,
    };
    UsersServices.GetUser(condition)
      .then(function (result) {
        if (result.data.length > 0) {
          result.data[0].is_approved = !result.data[0].is_approved;
          return UsersServices.UpdateUser(condition, result.data[0]);
        } else {
          return UtilsService.ErrorResp([], "Link Already Used");
        }
      })
      .then(function (Updated_result) {
        Updated_result.message = " Status Change Successfully";
        return res.json(Updated_result);
      })
      .catch(function (error) {
        console.error(error, "  - - - error = ");
        return res.json(error);
      });
  },

  ProfileImageUpload: function (req, res) {
    let ProfilePic = [];

    if (req.files.length > 0) {
      req.files.forEach((element) => {
        ProfilePic.push({ path: "public/images/profile/" + element.filename });
      });
    }
    let condition = {
      _id: req.body._id,
    };
    UsersServices.UpdateUser(condition, { profile_pic: ProfilePic })
      .then(function (result) {
        return res.json(result);
      })
      .catch(function (error) {
        console.error(error, "  - - - error = ");
        return res.json(error);
      });
  },

  ToggleNotification: (req, res) => {
    const data = req.body;
    UsersServices.UpdateUser({ _id: data._id }, { device_token: data.token })
      .then((result) => {
        return res.send(result);
      })
      .catch((e) => {
        return res.send(e);
      });
  },
  ItemNotification: (req, res) => {
    const data = req.body;
    if (data.token)
      UsersServices.UpdateUser({ _id: data._id }, { device_token: data.token });
    UsersServices.itemNotification(data._id, data.ItemID, data.remove)
      .then(function (result) {
        return res.json(result);
      })
      .catch(function (error) {
        console.error(error, "  - - - error = ");
        return res.json(error);
      });
  },
  //-----------Forget Password------------------
  Reset_Password: async (req, res) => {
    var data = req.body;
    // const salt = await bcrypt.genSalt(10);
    const pwd = await bcrypt.hash(data.password, salt);
    // var pwd = cryptoJs.SHA256(data.password);
    data.password = pwd;
    var condition = {
      mobile: data.mobile,
    };
    UsersServices.GetUser(condition)
      .then((result) => {
        if (result.data.length > 0) {
          return UsersServices.UpdateUser(condition, {
            password: data.password,
          });
        } else {
          return res.json("Phone Number is not Register");
        }
      })
      .then(function (Updated_result) {
        Updated_result.message = "Password Reset Successfully";
        return res.json(Updated_result.message);
      })
      .catch(function (error) {
        console.error(error, "  - - - error = ");
        return res.json(error);
      });
  },

  //------check and set unique data for mobile, email-----------------------
  Reset_UniqueMobile: async (req, res) => {
    const data = req.body;
    if (!isNaN(data.mobile)) {
      condition = {
        _id: data._id,
      };
      await UsersServices.GetUser({ mobile: data.mobile })
        .then(async (result) => {
          if (result.data.length > 0) {
            return res.json("Already used mobile number");
          } else
            await UsersServices.UpdateUser(condition, { mobile: data.mobile })
              .then((result) => {
                res.json(result.message);
              })
              .catch((e) => {
                res.json("Somthing wants wrong...");
              });
        })
        .catch((e) => {
          return res.send(e);
        });
    } else return res.json("Please type a mobile number");
  },
  //------check and set unique data for mobile, email-----------------------
  Reset_UniqueEmail: async (req, res) => {
    const data = req.body;
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (data.email.match(mailformat)) {
      condition = {
        _id: data._id,
      };
      await UsersServices.GetUser({ email: data.email })
        .then(async (result) => {
          if (result.data.length > 0) {
            return res.json("Already used email");
          } else
            await UsersServices.UpdateUser(condition, { email: data.email })
              .then((result) => {
                res.json(result.message);
              })
              .catch((e) => {
                res.json("Somthing wants wrong...");
              });
        })
        .catch((e) => {
          return res.send(e);
        });
    } else return res.json("Please type an email");
  },
  // updateall: async function (req, res) {
  //   const result = await UserModels.find({
  //     role: 'Vendor',
  //   });
  //   const resss = await result.map(async (item, index) => {
  //     const count = await ItemModels.find({
  //       vendorId: item._id,
  //     });

  //     return {
  //       user: item,
  //       venueVendor: count,
  //     };
  //     // return count.map((data) => {
  //     //   return {
  //     //     VenueName: data.name,
  //     //     VenueMobile: data.contactPhone,
  //     //     Username: item.name,
  //     //     Usermobile: item.mobile,
  //     //     _id: data._id,
  //     //   };
  //     // });
  //   });

  //   let data1 = await Promise.all(resss);
  //   const data = data1.filter((value) => {
  //     return value.venueVendor.length === 1;
  //   });
  //   const data3 = data.map(async (value) => {
  //     try {
  //       const user = value.user;
  //       const count = value.venueVendor[0];
  //       if (count.type === 'Venue') {
  //         const data = {
  //           name: count?.name ? count?.name : '',
  //           company_name: count?.company_name ? count?.name : '',
  //           contactPhone: user?.mobile ? user?.mobile : '',
  //           contactEmail: count?.contactEmail ? count?.contactEmail : '',
  //           city: count?.city ? count?.city : '',
  //           state: count?.state ? count?.state : '',
  //           country: count?.country ? count?.country : '',
  //           zipcode: count?.zipcode ? count?.zipcode : '',
  //           address: count?.address ? count?.address : '',
  //           mainImage: count?.mainImage ? count?.mainImage : '',
  //           category: count?.category ? count?.category : '',
  //           description: count?.description ? count?.description : '',
  //           price: count?.price ? count?.price : '',
  //           secondNumbers: count?.secondNumbers ? count?.secondNumbers : [],
  //           plans: count?.plans ? count?.plans : [],
  //           termsandconditions: count?.termsandconditions
  //             ? count?.termsandconditions
  //             : '',
  //           brochure: count?.brochure ? count?.brochure : null,
  //           images: count?.images ? count?.images : [],
  //           vidLinks: count?.vidLinks ? count?.vidLinks : [],
  //           albums: count?.albums ? count?.albums : [],
  //           password: user?.password ? user?.password : '',
  //           menu: count?.menu ? count?.menu : [],
  //           vegPerPlate: count?.vegPerPlate ? count?.vegPerPlate : '',
  //           nonVegPerPlate: count?.nonVegPerPlate ? count?.nonVegPerPlate : '',
  //           amenities: count?.amenities ? count?.amenities : [],
  //           allowedVendors: count?.allowedVendors ? count?.allowedVendors : [],
  //           features: count?.features ? count?.features : [],
  //           popular: count?.popular ? count?.popular : false,
  //           fourStar: count?.fourStar ? count?.fourStar : false,
  //           fiveStar: count?.fiveStar ? count?.fiveStar : false,
  //           awarded: count?.awarded ? count?.awarded : false,
  //           exclusive: count?.exclusive ? count?.exclusive : false,
  //         };
  //         return await VenueUserModels.create(data);
  //       } else {
  //         const data = {
  //           name: count?.name ? count?.name : '',
  //           company_name: count?.company_name ? count?.company_name : '',
  //           contactPhone: user?.mobile ? user?.mobile : '',
  //           contactEmail: count?.contactEmail ? count?.contactEmail : '',
  //           city: count?.city ? count?.city : '',
  //           state: count?.state ? count?.state : '',
  //           country: count?.country ? count?.country : '',
  //           zipcode: count?.zipcode ? count?.zipcode : '',
  //           address: count?.address ? count?.address : '',
  //           mainImage: count?.mainImage ? count?.mainImage : '',
  //           category: count?.category ? count?.category : '',

  //           subCategory: count?.subCategory ? count?.subCategory : '',
  //           description: count?.description ? count?.description : '',
  //           price: count?.price ? count?.price : '',
  //           secondNumbers: count?.secondNumbers ? count?.secondNumbers : [],
  //           plans: count?.plans ? count?.plans : [],
  //           termsandconditions: count?.termsandconditions
  //             ? count?.termsandconditions
  //             : '',
  //           brochure: count?.brochure ? count?.brochure : null,
  //           images: count?.images ? count?.images : [],
  //           vidLinks: count?.vidLinks ? count?.vidLinks : [],
  //           albums: count?.albums ? count?.albums : [],
  //           password: user?.password ? user?.password : '',
  //           popular: count?.popular ? count?.popular : false,
  //           awarded: count?.awarded ? count?.awarded : false,
  //           exclusive: count?.exclusive ? count?.exclusive : false,
  //         };
  //         return await VendorUserModels.create(data);
  //       }
  //       // return result;
  //     } catch (error) {
  //       console.log(
  //         `🚀 ~ file: UserControllers.js:900 ~ data3 ~ error:`,
  //         error
  //       );
  //     }
  //   });
  //   // const data2 = [].concat(...data);
  //   // const data3 = data2.map(async (data) => {
  //   //   return await ItemModels.deleteOne({
  //   //     _id: data._id,
  //   //   });
  //   // });
  //   // const data4 = await Promise.all(data3);
  //   res.send({
  //     success: true,
  //     data: Promise.all(data3),
  //     // length: data4.length,
  //   });
  // },
};
