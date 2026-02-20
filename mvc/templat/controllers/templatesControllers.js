var {
  GetOne,
  Update,
  Create,
  GetMany,
  Delete,
  GetManyWithPagination,
  countDocuments,
} = require("../services/templatesServices");
const templateModal = require("../models/templatesModels");
var moment = require("moment");
const { replaceS3BaseUrl } = require("../../../utils");
module.exports = {
  UploadTemplates: async function (req, res) {
    try {
      const data = {
        data: JSON.parse(req.body.data),
        Images: req.files?.Img
          ? replaceS3BaseUrl(req.files?.Img[0].location)
          : "",
      };
      const Template = await Create(data);

      return res.status(200).send({
        success: true,
        message: "Image Upload successfully",
        data: Template,
      });
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
  GetTemplates: async function (req, res) {
    try {
      let condition;
      condition = {};
      const page = req.query.page ? req.query.page : 1;

      let Template = await GetManyWithPagination(condition, page, 8);
      console.log(
        `🚀 ~ file: templatesControllers.js:45 ~ Template:`,
        Template
      );
      Template = Template?.map((val) => {
        return {
          Images: val?.Images,
          _id: val?._id,
        };
      });
      const total = await countDocuments(condition);

      if (Template) {
        return res.status(200).send({
          success: true,
          message: "Template Fetched successfully",
          total,
          totalPage: Math.ceil(total / 8),
          page: page,
          pageSize: Template.length,
          data: Template,
        });
      } else {
        return res.status(200).send({
          message: "no Template found",
          data: [],
          success: false,
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
  GetTemplate: async function (req, res) {
    try {
      let condition;
      condition = { _id: req.params.id };

      const Template = await GetOne(condition);
      if (Template) {
        return res.status(200).send({
          success: true,
          message: "Template Fetched successfully",
          data: [Template],
        });
      } else {
        return res.status(200).send({
          message: "no Template found",
          data: [],
          success: false,
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
  DeleteTemplate: async function (req, res) {
    try {
      const condition = {
        _id: req.params.id,
      };
      await Delete(condition);
      res.status(200).send({
        success: true,
      });
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
  updateall: async function (req, res) {
    try {
      const customers = await templateModal.find();
      console.log(
        "🚀 ~ file: VenueUserControllers.js:1063 ~ customers:",
        customers
      );
      const customer = await customers.forEach(async (data1) => {
        const data = JSON.parse(JSON.stringify(data1));
        console.log(
          "🚀 ~ file: index.js:11 ~ db.venueusers.find ~ data:",
          data.Images,
          data._id
        );

        let newMain = "";
        if (
          (data?.Images && data.Images !== undefined) ||
          data.Images !== null
        ) {
          newMain = data?.Images?.replace(
            "https://wedcell.s3.ap-south-1.amazonaws.com",
            ""
          );
        }

        const w = {
          Images: newMain,
        };
        console.log(
          "🚀 ~ file: VenueUserControllers.js:1126 ~ customer ~ w:",
          w
        );
        const a = await templateModal.updateOne(
          { _id: data._id },
          {
            $set: w,
          }
        );
        console.log(
          "🚀 ~ file: VenueUserControllers.js:1129 ~ customer ~ a:",
          a
        );
      });
      res.send({
        data: customer,
      });
    } catch (error) {
      console.log(`🚀 ~ file: VenueUserControllers.js:775 ~ error:`, error);
      res.send({
        success: true,
        error,
        // length: data4.length,
      });
    }
  },
};
