const Otp = require("../models/OtpModal");
var otpGenerator = require("otp-generator");
var axios = require("axios");
var xoauth2 = require("xoauth2");
const {
  otpValidationMobile,
  otpValidationEmail,
} = require("../validation/OtpValidation");
var nodemailer = require("nodemailer");
const Vendor = require("../../vendor user/models/VendorUserModels");
const Venue = require("../../venue user/models/VenueUserModels");
const ShopNow = require("../../shop now user/models/ShopNowUserModels");

// var transporterMailtrap = nodemailer.createTransport({
//   host: "smtp.mailtrap.io",
//   port: 2525,
//   auth: {
//     user: "62fb374871a722",
//     pass: "69f1fec1c7fda5",
//   },
// });

var transporterMailtrap = nodemailer.createTransport({
  service: "gmail",
  auth: {
    xoauth2: xoauth2.createXOAuth2Generator({
      // user: '{username}',
      // clientId: '{Client ID}',
      // clientSecret: '{Client Secret}',
      // refreshToken: '{refresh-token}',
      // accessToken: '{cached access token}'
      user: "luckybelt79@gmail",
      pass: "evdfolixnkvihnfc",
    }),
  },
});

module.exports = {
  OrderSuccess: async (mobile, orderid) => {
    try {
      await otpValidationMobile.validate({
        mobile,
      });
      const message = ` Congratulations!+Your+order+${orderid}+has+been+successfully+placed.+We're+excited+to+serve+you.+Thank+you+for+choosing+us!+-+WedCell`;

      var url =
        "http://makemysms.in/api/sendsms.php?username=wedcell&password=01679b59&sender=WEDCEL" +
        "&mobile=91" +
        mobile +
        "&type=1&product=1&template=1707169259922107515" +
        "&message=" +
        message;

      await axios.post(url);
      return {
        success: true,
        mobile,
      };

      // await otpValidationEmail.validate({
      //   email,
      // });
      // var mailOptions = {
      //   from: 'luckybelt79@gmail',
      //   to: email,
      //   subject: 'email Verification',
      //   html: `Dear Customer Here is your OTP for Email verification : <b>${OTP} </b>`,
      // };

      // transporterMailtrap.sendMail(mailOptions, function (error, response) {
      //   if (error) {
      //     var resp = {
      //       success: false,
      //       message: 'Error in procesing',
      //       data: error,
      //     };
      //     res.status(500).send(resp);
      //     return;
      //   } else {

      //     var resp = {
      //       success: true,
      //       message: 'Mail Sent Successfully',
      //       data: response,
      //     };
      //     res.status(200).send(resp);
      //     return;
      //   }
      // });
    } catch (error) {
      return {
        success: false,
        message: error,
      };
    }
  },
  OrderCancel: async (mobile, orderid) => {
    try {
      await otpValidationMobile.validate({
        mobile,
      });
      const message = `Order+${orderid}+successfully+cancelled.+We+appreciate+your+understanding.+Thank+you+for+choosing+us.+-+WedCell`;

      var url =
        "http://makemysms.in/api/sendsms.php?username=wedcell&password=01679b59&sender=WEDCEL" +
        "&mobile=91" +
        mobile +
        "&type=1&product=1&template=1707169259925163416" +
        "&message=" +
        message;

      await axios.post(url);
      return {
        success: true,
        mobile,
      };

      // await otpValidationEmail.validate({
      //   email,
      // });
      // var mailOptions = {
      //   from: 'luckybelt79@gmail',
      //   to: email,
      //   subject: 'email Verification',
      //   html: `Dear Customer Here is your OTP for Email verification : <b>${OTP} </b>`,
      // };

      // transporterMailtrap.sendMail(mailOptions, function (error, response) {
      //   if (error) {
      //     var resp = {
      //       success: false,
      //       message: 'Error in procesing',
      //       data: error,
      //     };
      //     res.status(500).send(resp);
      //     return;
      //   } else {

      //     var resp = {
      //       success: true,
      //       message: 'Mail Sent Successfully',
      //       data: response,
      //     };
      //     res.status(200).send(resp);
      //     return;
      //   }
      // });
    } catch (error) {
      return {
        success: false,
        message: error,
      };
    }
  },
  SendOtp: async (req, res) => {
    try {
      const { mobile, email } = req.body;

      const OTP = otpGenerator.generate(6, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
    });      
      // const OTP = 123456;
      if (mobile) {
        await otpValidationMobile.validate({
          mobile,
        });
        const message = `Your OTP for logging in to Wedcell account is ${OTP}.OTP is valid till 5 min.Do not share with anyone.`;
        // var url =
        //   // `https://apicloudstack.com/api/send?number=${
        //   //   req.body.mobile
        //   // }&type=text&message=${message} &instance_id=${process.env.WHATSAPP_INSTANCE_ID}&access_token=${
        //   //   process.env.WHATSAPP_ACCES_TOKEN
        //   // }`;
        //   'http://makemysms.in/api/sendsms.php?username=wedcell&password=01679b59&sender=WEDCEL' +
        //   '&mobile=91' +
        //   req.body.mobile +
        //   '&type=1&product=1&template=1707163853590237508' +
        //   '&message=' +
        console.log(req.body.mobile.replace(/^.{2}/g, ""));
        // var url =
        // "http://makemysms.in/api/sendsms.php?username=wedcell&password=01679b59&sender=WEDCEL" +
        // "&mobile=91" +
        // req.body.mobile.replace(/^.{2}/g, "") +
        // "&type=1&product=1&template=1707163853590237508" +
        // "&message=Your OTP for logging in to Wedcell account is " +
        // OTP +
        // ". OTP is valid till 5 min. Do not share with anyone.";

        var url =
          "https://mdssend.in/api.php?username=wedcell&apikey=hgxh1hv0Ron8&senderid=WEDCEL&route=TRANS" +
          "&mobile=91" +
          req.body.mobile.replace(/^.{2}/g, "") +
          "&text=Your OTP for logging in to Wedcell account is " +
          OTP +
          ". OTP is valid till 5 min. Do not share with anyone.";

        let otp = await Otp.findOneAndUpdate(
          { mobile },
          { mobile, otp: OTP },
          { useFindAndModify: false, new: true }
        );
        if (!otp) {
          otp = new Otp({ otp: OTP, mobile });
          otp = await otp.save();
        }
        if (otp) {
          const result = await axios.get(url);
          console.log(
            `🚀 ~ SendOtp: ~ req.body.mobile:`,
            req.body.mobile,
            result
          );

          res.status(200).send({
            success: true,
            mobile,
          });
        } else {
          res.status(400).send({
            success: false,
            message: "number dont exist on Whatsapp",
          });
        }
      } else {
        await otpValidationEmail.validate({
          email,
        });
        var mailOptions = {
          from: "luckybelt79@gmail",
          to: email,
          subject: "email Verification",
          html: `Dear Customer Here is your OTP for Email verification : <b>${OTP} </b>`,
        };

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
              data: response,
            };
            res.status(200).send(resp);
            return;
          }
        });
      }
    } catch (error) {
      console.log("🚀 ~ SendOtp: ~ error:", error);
      res.status(400).send({
        message: error,
      });
    }
  },
  VerifyOtp: async (req, res) => {
    try {
      const { mobile, email, otp } = req.body;

      if (mobile) {
        await otpValidationMobile.validate({
          mobile,
        });
        let findedOtp = await Otp.findOne({ mobile: mobile });

        if (!findedOtp) {
          return res.status(404).send({
            success: false,
            error: {
              message: "otp expires",
            },
          });
        }

        // if (findedOtp.otp != otp) {
        console.log("🚀 ~ VerifyOtp: ~ findedOtp:", findedOtp, otp);
        if (findedOtp.otp != otp) {
          return res.status(400).send({
            success: false,
            error: {
              message: "incorrect otp",
            },
          });
        }

        return res.status(200).send({
          success: true,
        });
      } else {
        await otpValidationEmail.validate({
          email,
        });
        var mailOptions = {
          from: "luckybelt79@gmail",
          to: email,
          subject: "email Verification",
          html: `Dear Customer Here is your OTP for Email verification : <b>${OTP} </b>`,
        };

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
              data: response,
            };
            res.status(200).send(resp);
            return;
          }
        });
      }
    } catch (error) {
      console.log("🚀 ~ VerifyOtp: ~ error:", error);
      res.status(400).send({
        message: error,
      });
    }
  },
  isWorking: (req, res) => {
    res.status(200).send({
      success: true,
    });
  },
};
