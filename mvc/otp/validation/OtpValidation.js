const { object, string, number, date, InferType } = require("yup");

module.exports = {
  otpValidationMobile: object({
    mobile: string().required("No mobile number provided."),
  }),
  otpValidationEmail: object({
    email: string().email().required("email format not correct"),
  }),
};
