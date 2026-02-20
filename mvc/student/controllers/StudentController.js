const Student = require("../models/StudentModal");
const Otp = require("../../otp/models/OtpModal");
const bcrypt = require("bcrypt");
var salt = "$2b$10$pm4WmosjwhVivTDHxkCoiO";
var config = require("../../../config/config");
var jwt = require("jsonwebtoken");
const {
  signupValidation,
  loginValidation,
  updateValidation,
  changePasswordValidation,
} = require("../validations/studentValidation");
const { async } = require("q");
const { replaceS3BaseUrl } = require("../../../utils");
module.exports = {
  login: async (req, res) => {
    try {
      const { mobile, password } = req.body;
      await loginValidation.validate(req.body);
      let student = await Student.findOne({ mobile: mobile });
      console.log(1);
      if (!student) {
        res.status(400).send({
          success: false,
          error: {
            message: "mobile number not found",
          },
        });
        return;
      }

      const userPasswordbcrypt = await bcrypt.hash(password, salt);
      if (student.password !== userPasswordbcrypt) {
        res.status(404).send({
          success: false,
          error: {
            message: "incorrect password",
          },
        });
        return;
      }
      console.log("STUD", student.id);
      let token = jwt.sign(
        {
          _id: student.id,
          role: "Student",
        },
        config.secret
      );
      console.log(token);
      student.token = token;
      // student = {
      //   student: student._doc,
      //   token,
      //   success: true,
      // };
      console.log(2, student);

      res.status(200).send({ data: student, success: true, token: token });
    } catch (error) {
      res.status(400).send({
        error,
      });
    }
  },
  signup: async (req, res) => {
    try {
      const { mobile, otp, name, password } = req.body;
      await signupValidation.validate(req.body);
      const findStud = await Student.findOne({ mobile: mobile });
      if (findStud) {
        res.status(404).send({
          success: false,
          error: {
            message: "mobile number already registered",
          },
          findStud: findStud,
        });
        return;
      }

      let findedOtp = await Otp.findOne({ mobile: mobile });

      if (!findedOtp) {
        res.status(404).send({
          success: false,
          error: {
            message: "mobile number not found or otp expires",
          },
        });
      }

      if (findedOtp.otp !== otp) {
        res.status(400).send({
          success: false,
          error: {
            message: "incorrect otp",
          },
        });
      }
      const userPasswordbcrypt = await bcrypt.hash(password, salt);
      let student = new Student({
        mobile,
        password: userPasswordbcrypt,
        name,
        is_mobile_verified: true,
        is_approved: true,
      });
      student = await student.save();
      student = {
        ...student._doc,
        success: true,
      };

      res.status(200).send(student);
    } catch (error) {
      res.status(400).send({
        error,
      });
    }
  },
  isWorking: (req, res) => {
    res.status(200).send({
      success: true,
    });
  },
  update: async (req, res) => {
    try {
      if (Object.hasOwnProperty.bind(req.body)("is_delete")) {
        data = {
          is_delete: req.body.is_delete,
        };
        const student = await Student.findByIdAndUpdate(req.body._id, data, {
          new: true,
        });
        res.status(200).send({
          success: true,
          message: "student deleted successfully",
          data: student,
        });
      } else if (Object.hasOwnProperty.bind(req.body)("is_approved")) {
        data = {
          is_approved: req.body.is_approved,
        };
        const student = await Student.findByIdAndUpdate(req.body._id, data, {
          new: true,
        });
        res.status(200).send({
          success: true,
          message: "student successfully",
          data: student,
        });
      } else {
        const data = JSON.parse(req.body.data);
        await updateValidation.validate(data, {
          strict: true,
        });
        let coverLink = JSON.parse(req.body.coverlink);
        coverLink = coverLink.length ? coverLink : [];
        const findedStud = await Student.findById(req.user._id);

        if (findedStud.mobile !== req.body.mobile) {
          data.is_mobile_verified = false;
        } else {
          data.is_mobile_verified = true;
          data.is_approved = true;
        }
        if (findedStud.email !== req.body.email) {
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

        const student = await Student.findByIdAndUpdate(req.user._id, data, {
          new: true,
        });
        res.status(200).send({
          data: student,
          success: true,
        });
      }
    } catch (error) {
      console.error(
        `🚀 ~ file: StudentController.js:96 ~ update: ~ error:`,
        error
      );
      res.status(400).send({
        error,
      });
    }
  },
  getOne: async (req, res) => {
    try {
      const element = await Student.findById(req.params.id);

      let students;
      if (element) {
        students = {
          name: element.name,
          email: element.email,
          cover_pic: element.cover_pic,
          profile_pic: element.profile_pic,
          personaldetails: {
            height: element.personaldetails.height,
            eventsAttended: element.personaldetails.eventsAttended,
            skincolour: element.personaldetails.skincolour,
            internshipStatus: element.personaldetails.internshipStatus,
            diplomaStatus: element.personaldetails.diplomaStatus,
            currentlyEmployed: element.personaldetails.currentlyEmployed,
            language: element.personaldetails.language,
          },
          addressDetails: {
            pincode: element.addressDetails.pincode,
            city: element.addressDetails.city,
            state: element.addressDetails.state,
            country: element.addressDetails.country,
            address1: element.addressDetails.address1,
            address2: element.addressDetails.address2,
            landmark: element.addressDetails.landmark,
          },
          mobile: element.mobile,
        };
      }
      if (!students) {
        res.status(400).send({
          success: false,
          error: {
            message: "no Students found",
          },
        });
      } else {
        res.status(200).send(students);
      }
    } catch (error) {}
  },
  getAll: async (req, res) => {
    try {
      const students = await Student.find({
        is_approved: true,
        is_delete: false,
      });
      let stud;
      if (students.length) {
        stud = students.map((element) => {
          return {
            name: element.name,
            email: element.email,
            cover_pic: element.cover_pic,
            profile_pic: element.profile_pic,
            personaldetails: {
              height: element.personaldetails.height,
              eventsAttended: element.personaldetails.eventsAttended,
              skincolour: element.personaldetails.skincolour,
              internshipStatus: element.personaldetails.internshipStatus,
              diplomaStatus: element.personaldetails.diplomaStatus,
              currentlyEmployed: element.personaldetails.currentlyEmployed,
              language: element.personaldetails.language,
            },
            addressDetails: {
              pincode: element.addressDetails.pincode,
              city: element.addressDetails.city,
              state: element.addressDetails.state,
              country: element.addressDetails.country,
              address1: element.addressDetails.address1,
              address2: element.addressDetails.address2,
              landmark: element.addressDetails.landmark,
            },
            mobile: element.mobile,
            id: element._id,
          };
        });
      }
      if (!stud) {
        res.status(400).send({
          success: false,
          error: {
            message: "no Students found",
          },
        });
      } else {
        res.status(200).send(stud);
      }
    } catch (error) {
      res.status(400).send(error);
    }
  },
  getAllForAdmin: async (req, res) => {
    try {
      const students = await Student.find({});
      let stud;
      if (students.length) {
        stud = students.map((element) => {
          return {
            name: element.name,
            email: element.email,
            cover_pic: element.cover_pic,
            profile_pic: element.profile_pic,
            personaldetails: {
              height: element.personaldetails.height,
              eventsAttended: element.personaldetails.eventsAttended,
              skincolour: element.personaldetails.skincolour,
              internshipStatus: element.personaldetails.internshipStatus,
              diplomaStatus: element.personaldetails.diplomaStatus,
              currentlyEmployed: element.personaldetails.currentlyEmployed,
              language: element.personaldetails.language,
            },
            addressDetails: {
              pincode: element.addressDetails.pincode,
              city: element.addressDetails.city,
              state: element.addressDetails.state,
              country: element.addressDetails.country,
              address1: element.addressDetails.address1,
              address2: element.addressDetails.address2,
              landmark: element.addressDetails.landmark,
            },
            mobile: element.mobile,
            is_approved: element.is_approved,
            is_delete: element.is_delete,
            id: element._id,
          };
        });
      }
      if (!stud) {
        res.status(400).send({
          success: false,
          error: {
            message: "no Students found",
          },
        });
      } else {
        res.status(200).send(stud);
      }
    } catch (error) {
      res.status(400).send(error);
    }
  },
  getAllByCity: async (req, res) => {
    console.log(req.params);
    try {
      const students = await Student.find({
        is_approved: true,
        "addressDetails.city": new RegExp(`^${req.params.id}$`, "i"),
      });
      console.log(students);
      let stud;
      if (students.length) {
        stud = students.map((element) => {
          return {
            name: element.name,
            email: element.email,
            cover_pic: element.cover_pic,
            profile_pic: element.profile_pic,
            personaldetails: {
              height: element.personaldetails.height,
              eventsAttended: element.personaldetails.eventsAttended,
              skincolour: element.personaldetails.skincolour,
              internshipStatus: element.personaldetails.internshipStatus,
              diplomaStatus: element.personaldetails.diplomaStatus,
              currentlyEmployed: element.personaldetails.currentlyEmployed,
              language: element.personaldetails.language,
            },
            addressDetails: {
              pincode: element.addressDetails.pincode,
              city: element.addressDetails.city,
              state: element.addressDetails.state,
              country: element.addressDetails.country,
              address1: element.addressDetails.address1,
              address2: element.addressDetails.address2,
              landmark: element.addressDetails.landmark,
            },
            mobile: element.mobile,
            id: element._id,
          };
        });
      }
      if (!stud) {
        res.status(200).send(stud);
      } else {
        res.status(200).send(stud);
      }
    } catch (error) {
      res.status(400).send(error);
    }
  },
  verify: async (req, res) => {
    try {
      const findedStud = await Student.findById(req.user._id);
      let updatedStud;
      if (req.body.mobile) {
        if (findedStud) {
          updatedStud = await Student.findByIdAndUpdate(req.user._id, {
            is_mobile_verified: true,
            is_approved: true,
            mobile: req.body.mobile,
          });
        }
      }
      if (req.body.email) {
        if (findedStud) {
          updatedStud = await Student.findByIdAndUpdate(req.user._id, {
            is_email_verified: true,
            is_approved: true,
            email: req.body.email,
          });
        }
      }
      res.status(200).send({
        success: true,
      });
    } catch (error) {
      console.error(
        `🚀 ~ file: StudentController.js:288 ~ verify: ~ error:`,
        error
      );
      res.status(200).send({
        success: false,
        error,
      });
    }
  },
  changePassword: async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    try {
      await changePasswordValidation.validate({ newPassword });
      let student = await Student.findById(req.user._id);
      if (!student) {
        res.status(400).send({
          success: false,
          error: {
            message: "mobile number not found",
          },
        });
      }
      const userPasswordbcrypt = await bcrypt.hash(currentPassword, salt);
      if (student.password !== userPasswordbcrypt) {
        res.status(404).send({
          success: false,
          error: {
            message: "incorrect password",
          },
        });
      }
      const userNewPasswordbcrypt = await bcrypt.hash(newPassword, salt);
      const ChangedPassword = await Student.findByIdAndUpdate(req.user._id, {
        password: userNewPasswordbcrypt,
      });
      if (ChangedPassword) {
        res.status(200).send({
          success: true,
        });
        return;
      }
    } catch (error) {
      console.error(
        `🚀 ~ file: StudentController.js:397 ~ changePassword: ~ error:`,
        error
      );
      res.status(400).send({
        success: false,
        error,
      });
    }
  },
};
