// var {
//   GetOne,
//   Update,
//   GetMany,
//   Create,
//   countDocuments,
//   Delete,
// } = require("../services/InhouseServices");
const OtherModel = require("../models/OtherModel");
const VenueModel = require("../models/VenueModel");
var { VenueServices, OtherServices } = require("../services/InhouseServices");
var moment = require("moment");

const GetVenueInhouse = async (req, res) => {
  const result = await VenueServices.GetManyWithPagination(
    {},
    req.params.page,
    20
  );
  console.log(
    `🚀 ~ file: InhouseControllers.js:20 ~ GetVenueInhouse ~ result:`,
    result
  );
  const total = await VenueServices.countDocuments({});
  try {
    if (result.length > 0) {
      res.status(200).send({
        success: true,
        message: "Get Successfully",
        total,
        totalPage: Math.ceil(total / 20),
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

const CreateVenueInhouse = async (req, res) => {
  const { name, doe, number, city, toe, budgetHotel, payment_id } = req.body;
  try {
    if (name && doe && number && city && toe && budgetHotel && payment_id) {
      const response = await VenueServices.Create(req?.body);
      res.json({
        status: 200,
        venues: response,
        message: "venue created successfully...",
      });
    } else {
      res.send("all fields are required");
    }
  } catch (error) {
    console.log(error);
  }
};
const GetOtherInhouse = async (req, res) => {
  const result = await OtherServices.GetManyWithPagination(
    {},
    req.params.page,
    20
  );
  const total = await OtherServices.countDocuments({});
  try {
    if (result.length > 0) {
      res.status(200).send({
        success: true,
        message: "Get Successfully",
        total,
        totalPage: Math.ceil(total / 20),
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
    slot,
    number,
    address,
    requirments,
    paymentType,
    paidPayment,
    totalPayment,
    // payment_id,
    people,
    eventDate,
    remainingpayment,
  } = req.body;
  try {
    if (
      name &&
      slot &&
      number &&
      address &&
      requirments &&
      paymentType &&
      paidPayment &&
      totalPayment &&
      // payment_id &&
      people &&
      remainingpayment !== undefined &&
      eventDate
    ) {
      const response = await OtherServices.Create(req?.body);
      res.json({
        status: 200,
        venues: response,
        message: "venue created successfully...",
      });
    } else {
      console.log(
        `🚀 ~ file: InhouseControllers.js:118 ~ CreateOtherInhouse ~ all fields are required:`,
        name,
        slot,
        number,
        address,
        requirments,
        paymentType,
        remainingpayment,
        paidPayment,
        totalPayment,
        payment_id,
        eventDate
      );
      res.status(400).send({
        message: "all fields are required",
        name,
        slot,
        number,
        address,
        requirments,
        paymentType,
        remainingpayment,
        paidPayment,
        totalPayment,
        payment_id,
      });
    }
  } catch (error) {
    console.log(error);
  }
};
const VenuefullTextSearch = async (req, res) => {
  let searchString = req.params.search;

  try {
    const result = await VenueModel.find(
      {
        $text: { $search: searchString },
      },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .skip((req.params.page - 1) * 20)
      .limit(20);
    const total = await VenueServices.countDocuments({
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
const OtherfullTextSearch = async (req, res) => {
  let searchString = req.params.search;

  try {
    const result = await OtherModel.find(
      {
        $text: { $search: searchString },
      },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .skip((req.params.page - 1) * 20)
      .limit(20);
    const total = await OtherServices.countDocuments({
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
  CreateVenueInhouse,
  GetVenueInhouse,
  CreateOtherInhouse,
  GetOtherInhouse,
  VenuefullTextSearch,
  OtherfullTextSearch,
};
