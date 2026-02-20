const { replaceS3BaseUrl } = require("../../../utils");
var {
  GetOne,
  Update,
  Create,
  GetMany,
  Delete,
  countDocuments,
  GetManyWithPagination,
} = require("../services/InvitesImgServices");
var moment = require("moment");
module.exports = {
  UploadInviteImage: async function (req, res) {
    try {
      const data = {
        userId: req.user._id,
        Images: req.files?.Img
          ? replaceS3BaseUrl(req.files?.Img[0].location)
          : "",
      };
      Invites = await Create(data);

      return res.status(200).send({
        success: true,
        message: "Image Upload successfully",
        data: Invites,
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
  GetInvitesImg: async function (req, res) {
    try {
      let condition;
      condition = {
        userId: req.user._id,
      };

      const Invites = await GetMany(condition);
      condition = {
        isAdmin: true,
      };
      const AdminImg = await GetMany(condition);
      if (Invites) {
        return res.status(200).send({
          success: true,
          message: "Invites Fetched successfully",
          data: Invites,
          adminImg: AdminImg,
        });
      } else {
        return res.status(200).send({
          message: "no Invites found",
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
  DeleteImg: async function (req, res) {
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
  GetforAdmin: async function (req, res) {
    try {
      let condition = { isAdmin: true };
      if (req.query.type) {
        condition = {
          isAdmin: true,
          type2: req.query.type && req.query.type,
        };
      }
      if (req.query.Subtype !== "false") {
        condition = {
          ...condition,
          Subtype: req.query.Subtype,
        };
      }
      const page = req.query.page ? req.query.page : 1;

      console.log(
        `🚀 ~ file: InvitesImgControllers.js:108 ~ condition:`,
        condition,
        req.query.Subtype
      );
      const data = await GetManyWithPagination(condition, page, 8);
      const total = await countDocuments(condition);

      res.status(200).send({
        data: data,
        success: true,
        message: "Template Fetched successfully",
        total,
        totalPage: Math.ceil(total / 8),
        page: page,
        pageSize: data.length,
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
  UploadforAdmin: async function (req, res) {
    try {
      let data = {};
      if (!req.body.Subtype) {
        data = {
          isAdmin: true,
          dataurl: req.body?.dataurl,
          type1: req.body?.type1,
          type2: req.body?.type2,
        };
      } else {
        console.log(
          `🚀 ~ file: InvitesImgControllers.js:130 ~ req.body.Subtype:`,
          req.body.Subtype
        );
        data = {
          isAdmin: true,
          dataurl: req.body?.dataurl,
          type1: req.body?.type1,
          type2: req.body?.type2,
          Subtype: req.body.Subtype,
        };
      }
      Invites = await Create(data);

      return res.status(200).send({
        success: true,
        message: "Image Upload successfully",
        data: Invites,
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
