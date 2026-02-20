const Yup = require("yup");
const YupPassword = require("yup-password");
YupPassword(Yup);

module.exports = {
  loginValidation: Yup.object({
    mobile: Yup.string().required("No mobile number provided."),
    password: Yup.string().required("No password provided."),
  }),
  signupValidation: Yup.object({
    mobile: Yup.string().required("No mobile number provided."),
    otp: Yup.string()
      .min(6, "otp is too short")
      .max(6, "otp is too big")
      .required("No otp provided."),
    name: Yup.string()
      .min(3, "name is too short")
      .max(100, "name is too big")
      .required("No name provided."),
    password: Yup.string()
      .required("No password provided.")
      .min(
        8,
        "password must contain 8 or more characters with at least one of each: uppercase, lowercase, number and special"
      )
      .minLowercase(1, "password must contain at least 1 lower case letter")
      .minUppercase(1, "password must contain at least 1 upper case letter")
      .minNumbers(1, "password must contain at least 1 number")
      .minSymbols(1, "password must contain at least 1 special character"),
  }),
  changePasswordValidation: Yup.object({
    newPassword: Yup.string()
      .required("No password provided.")
      .min(
        8,
        "password must contain 8 or more characters with at least one of each: uppercase, lowercase, number and special"
      )
      .minLowercase(1, "password must contain at least 1 lower case letter")
      .minUppercase(1, "password must contain at least 1 upper case letter")
      .minNumbers(1, "password must contain at least 1 number")
      .minSymbols(1, "password must contain at least 1 special character"),
  }),
  updateValidation: Yup.object({
    name: Yup.string()
      .min(3, "name is too short")
      .max(100, "name is too big")
      .required("No name provided."),

    email: Yup.string()
      .email("email format not correct")
      .required("No email provided."),
    personaldetails: Yup.object({
      height: Yup.number()
        .required("No height provided.")
        .min(3, "invalid height provided")
        .max(12, "invalid height provided"),
      eventsAttended: Yup.number()
        .min(0, "invalid height provided")
        .max(99999, "invalid height provided")
        .required("add 0 if no event attended"),
      skincolour: Yup.string().required("No skin colour provided."),
      internshipStatus: Yup.boolean().required(
        "No internship status provided."
      ),
      diplomaStatus: Yup.boolean().required("No diploma status provided."),
      currentlyEmployed: Yup.boolean().required(
        "No currently employed provided."
      ),
      language: Yup.string().required("No language provided."),
    }),
    addressDetails: Yup.object({
      pincode: Yup.string()
        .min(6, "pincode is too short")
        .max(6, "pincode is too big")
        .required("No pincode provided."),
      city: Yup.string().required("No city provided."),
      state: Yup.string().required("No state provided."),
      country: Yup.string().required("No country provided."),
      address1: Yup.string().required("No address1 provided."),
      address2: Yup.string().required("No address2 provided."),
      landmark: Yup.string().required("No landmark provided."),
    }),
    mobile: Yup.string()
      .min(10, "mobile number is too short")
      .max(10, "mobile number is too big")
      .required("No mobile number provided."),
  }),
};
