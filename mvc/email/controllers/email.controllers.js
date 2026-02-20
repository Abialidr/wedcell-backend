var EmailService = require("../services/email.services");
var UsersService = require("../../users/services/UserServices");
var UtilsServices = require("../../utils/services/UtilsServices");
var ip = require("ip");
var CryptoJS = require("crypto-js");
const bcrypt = require("bcrypt");
var salt = "$2b$10$pm4WmosjwhVivTDHxkCoiO";
module.exports = {
  ForgotPassword: async function (req, res) {
    let { mobile } = req.body;
    let condition = { mobile };
    UsersService.GetUser(condition)
      .then(function (result) {
        if (result.success) {
          let mobileotp = UtilsServices.RandomNumber();
          let data = { mobileotp };
          UsersService.UpdateUser(condition, data)
            .then(function (result) {
              if (result.success) {
                UtilsServices.SendSMS(
                  mobile,
                  `Hello your otp is ${mobileotp}`,
                  (err, response, message) => {
                    // if (err) {
                    //   var resp = { success: false, message: "Fail to send sms", data: response };
                    //   return res.json(resp);
                    // } else {
                    // var resp = { success: true, message, data: response };
                    var resp = {
                      success: true,
                      message: `Hello your otp is ${mobileotp}`,
                      data: response,
                    };
                    return res.json(resp);
                    // }
                  }
                );
              } else return res.json(result);
            })
            .catch(function (error) {
              return res.json(error);
            });
        } else return res.json(result);
      })
      .catch(function (error) {
        console.error(error, "  - - - error = ");
        return res.json(error);
      });
  },

  ResetPassword: async function (req, res) {
    let { mobile, otp, password, c_password } = req.body;
    if (password != c_password) {
      return {
        success: false,
        message: "Password and confirm password must be same.",
        data: {},
      };
    }
    // const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(data.password, salt);
    // password = CryptoJS.SHA256(password).toString();
    let condition = { mobile };
    UsersService.GetUser(condition)
      .then(function (result) {
        if (result.success && result.data.length > 0) {
          if (parseInt(result.data[0].mobileotp) == otp) {
            let data = { password, mobileotp: "" };
            UsersService.UpdateUser(condition, data)
              .then(function (result) {
                return res.json(result);
              })
              .catch(function (error) {
                return res.json(error);
              });
          } else {
            return res.json({
              success: false,
              message: "OTP incorrect.",
              data: {},
            });
          }
        } else return res.json({ success: false, message: "Mobile number incorrect.", data: {} });
      })
      .catch(function (error) {
        console.error(error, "  - - - error = ");
        return res.json(error);
      });
  },
};
