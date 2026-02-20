const mongoose = require("mongoose");
const adminModel = require("../model/adminModel");
const venuesUserModel = require("../../venue user/models/VenueUserModels");
const vendorUserModel = require("../../vendor user/models/VendorUserModels");
const shopnowUserModel = require("../../shop now user/models/ShopNowUserModels");
const UserModel = require("../../customer/models/CustomerModels");
const studentuserModel = require("../../student/models/StudentModal");
const inhouseOtherModel = require("../../inhouse services/models/OtherModel");
const inhouseVennuerModel = require("../../inhouse services/models/VenueModel");
const blogModal = require("../../blogs/models/BlogsModel");
const orderModal = require("../../orders/models/orderModels");

const isValid = (value) => {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  if (typeof value === "number" && value.toString().trim().length === 0)
    return false;
  if (value instanceof Array && value.length === 0) return false;
  return true;
};
// const isValidRequestBody = (requestBody) => {
//     if (Object.keys(requestBody).length) return true
//     return false;
// }
const isValidRequestBody = function (requestBody) {
  return Object.keys(requestBody).length > 0;
};

const adminDocuments = async function (req, res) {
  let data = req.body;

  //Object destructuring
  let {
    uplodBanner,
    brideName,
    groomName,
    cityName,
    eventDate,
    galaryImage,
    uploadAlbum,
    youtubeVideos,
    vender,
  } = data;

  if (!isValid(isValidRequestBody)) {
    return res
      .status(400)
      .send({ status: false, message: "please provide input credentials" });
  }

  if (!isValid(uplodBanner)) {
    return res
      .status(400)
      .send({ status: false, message: "please provide banner credentials" });
  }

  if (!isValid(brideName)) {
    return res
      .status(400)
      .send({ status: false, message: "please provide brideName credentials" });
  }
  if (!isValid(groomName)) {
    return res
      .status(400)
      .send({ status: false, message: "please provide groomName credentials" });
  }
  if (!isValid(cityName)) {
    return res
      .status(400)
      .send({ status: false, message: "please provide cityName credentials" });
  }

  if (!isValid(eventDate)) {
    return res
      .status(400)
      .send({ status: false, message: "please provide eventDate credentials" });
  }
  if (!isValid(galaryImage)) {
    return res.status(400).send({
      status: false,
      message: "please provide galaryImage credentials",
    });
  }
  if (!isValid(uploadAlbum)) {
    return res.status(400).send({
      status: false,
      message: "please provide uploadAlbum credentials",
    });
  }
  if (!isValid(youtubeVideos)) {
    return res.status(400).send({
      status: false,
      message: "please provide youtubeVideos credentials",
    });
  }
  if (!isValid(vender)) {
    return res
      .status(400)
      .send({ status: false, message: "please provide vender credentials" });
  }

  try {
    const newAdmin = await adminModel.create(data);
    // return res.status(201).send({ status: true, message: " documents added successfully", data: newAdmin })
    res.status(200).json(newAdmin);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const getalladminDocuments = async function (req, res) {
  try {
    const condition = {};
    if (req.params.id !== "all") {
      condition.cityName = req.params.id;
    }
    //fetch all  adminDocuments
    const alladminModel = await adminModel.find(condition);
    res.status(200).json(alladminModel);
    return;
  } catch (err) {
    return res.status(500).json(err);
  }
};
const getalladminReports = async function (req, res) {
  try {
    const totalvenue = await venuesUserModel.countDocuments();
    const totalvendor = await vendorUserModel.countDocuments();
    const totalshopnow = await shopnowUserModel.countDocuments();
    const totaluser = await UserModel.countDocuments();
    const totalstudent = await studentuserModel.countDocuments();
    const totalotherser = await inhouseOtherModel.countDocuments();
    const totalvenuerser = await inhouseVennuerModel.countDocuments();
    const totalblog = await blogModal.countDocuments();
    const totalrealwed = await adminModel.countDocuments();
    const totalorder = await orderModal.countDocuments();
    const totalListing =
      totalvenue + totalvendor + totalshopnow + totaluser + totalstudent;
    res.status(200).send({
      totalListing,
      totalvenue,
      totalvendor,
      totalshopnow,
      totaluser,
      totalstudent,
      totalotherser,
      totalvenuerser,
      totalblog,
      totalrealwed,
      totalorder,
    });
  } catch (err) {
    console.log(
      `🚀 ~ file: adminController.js:123 ~ getalladminReports ~ err:`,
      err
    );
    return res.status(500).json(err);
  }
};

module.exports = { adminDocuments, getalladminDocuments, getalladminReports };
