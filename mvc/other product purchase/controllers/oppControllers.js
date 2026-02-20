// var {
//   GetOne,
//   Update,
//   GetMany,
//   Create,
//   countDocuments,
//   Delete,
// } = require("../services/InhouseServices");
const OppModal = require("../models/oppModel");
var { OppServices } = require("../services/oppServices");
var moment = require("moment");

const GetOtherInhouse = async (req, res) => {
  const condition = {};
  if (req?.query?.user_id) {
    condition.user_id = req.query.user_id;
  }
  if (req?.query?.vendor_id) {
    condition.vendor_id = req.query.vendor_id;
  }
  const result = await OppServices.GetManyWithPagination(
    condition,
    req.params.page,
    req.query.skip ? parseInt(req.query.skip) : 20
  );
  console.log(
    "🚀 ~ file: oppControllers.js:45 ~ GetOtherInhouse ~ req.query.skip:",
    condition,
    req.params.page,
    req.query.skip ? parseInt(req.query.skip) : 20
  );
  const total = await OppServices.countDocuments(condition);
  try {
    if (result.length > 0) {
      res.status(200).send({
        success: true,
        message: "Get Successfully",
        total,
        totalPage: Math.ceil(total / req.query.skip),
        page: req.params.page,
        pageSize: result.length,
        data: result,
      });
    } else {
      res.send("there is no venue exists at the moments");
    }
  } catch (error) {
    console.log(error);
  }
};

const CreateOtherInhouse = async (req, res) => {
  const {
    name,
    number,
    address,
    requirments,
    paymentType,
    paidPayment,
    totalPayment,
    vendor_id,
    eventDate,
    remainingpayment,
    qauntity,
  } = req.body;
  try {
    if (
      name &&
      number &&
      address &&
      requirments &&
      paymentType &&
      paidPayment &&
      totalPayment &&
      vendor_id &&
      qauntity &&
      remainingpayment !== undefined &&
      eventDate
    ) {
      const response = await OppServices.Create({
        ...req?.body,
        user_id: req.user._id,
      });
      res.json({
        status: 200,
        venues: response,
        message: "venue created successfully...",
      });
    } else {
      console.log(
        `🚀 ~ file: InhouseControllers.js:118 ~ CreateOtherInhouse ~ all fields are required:`,
        name,
        number,
        address,
        requirments,
        paymentType,
        remainingpayment,
        paidPayment,
        totalPayment,
        vendor_id,
        eventDate
      );
      res.status(400).send({
        message: "all fields are required",
        name,
        number,
        address,
        requirments,
        paymentType,
        remainingpayment,
        paidPayment,
        totalPayment,
        vendor_id,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const OtherfullTextSearch = async (req, res) => {
  let searchString = req.params.search;
  const condition = {};
  if (req.query.user_id) {
    condition.user_id = req.query.user_id;
  }
  if (req.query.user_id) {
    condition.vendor_id = req.query.vendor_id;
  }
  try {
    const result = await OppModal.find(
      {
        $text: { $search: searchString },
        ...condition,
      },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .skip((req.params.page - 1) * req.query.skip)
      .limit(req.query.skip);
    const total = await OppServices.countDocuments({
      $text: { $search: searchString },
    });

    res.status(200).send({
      success: true,
      message: "Items Gets Successfully",
      total,
      totalPage: Math.ceil(total / 20),
      page: req.params.page,
      pageSize: result.length,
      data: result,
    });
  } catch (error) {
    console.error(
      "🚀 ~ file: VenueUserControllers.js:522 ~ fullTextSearch: ~ error:",
      error
    );
    res.status(200).send({
      success: false,
      message: "Error in processing",
      data: error,
    });
  }
};
module.exports = {
  CreateOtherInhouse,
  GetOtherInhouse,
  OtherfullTextSearch,
};
