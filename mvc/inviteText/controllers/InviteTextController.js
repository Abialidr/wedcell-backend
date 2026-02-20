const { replaceS3BaseUrl } = require("../../../utils");
var {
  GetOne,
  Update,
  Create,
  GetMany,
  Delete,
} = require("../services/InviteTextServices");
var moment = require("moment");
module.exports = {
  UploadInviteTexts: async function (req, res) {
    try {
      let types;
      if (req.query.type === "Text") {
        types = "Text";
      } else {
        types = "RSVP";
      }
      let data;
      if (req.query.Subtype !== "false") {
        data = {
          data: req.body.data,
          Images: req.files?.Img
            ? replaceS3BaseUrl(req.files?.Img[0].location)
            : "",
          type: types,
          Subtype: req.query.Subtype,
        };
      } else {
        data = {
          data: req.body.data,
          Images: req.files?.Img
            ? replaceS3BaseUrl(req.files?.Img[0].location)
            : "",
          type: types,
        };
      }
      const InviteText = await Create(data);

      return res.status(200).send({
        success: true,
        message: "Image Upload successfully",
        data: InviteText,
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
  GetInviteText: async function (req, res) {
    try {
      let condition;
      if (req.query.Subtype !== "false") {
        condition = {
          type: req.query.type,
          Subtype: req.query.Subtype,
        };
      } else {
        condition = {
          type: req.query.type,
        };
      }

      const InviteText = await GetMany(condition);
      if (InviteText) {
        return res.status(200).send({
          success: true,
          message: "InviteText Fetched successfully",
          data: InviteText,
        });
      } else {
        return res.status(200).send({
          message: "no InviteText found",
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
  DeleteInviteText: async function (req, res) {
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
};
