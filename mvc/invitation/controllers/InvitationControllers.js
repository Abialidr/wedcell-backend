const { replaceS3BaseUrl } = require("../../../utils");
var { GetOne, Update, Create } = require("../services/InvitationServices");
var moment = require("moment");
module.exports = {
  UpdateInvites: async function (req, res) {
    try {
      let coverPicLink = req.body.coverPicLink
        ? JSON.parse(req.body.coverPicLink)
        : [];
      coverPicLink = coverPicLink.length ? coverPicLink : [];
      let coverPic = req.files?.coverPic
        ? req.files?.coverPic.map((item) => replaceS3BaseUrl(item.location))
        : [];
      coverPic = [...coverPic, ...coverPicLink];

      const condition = {
        userId: req.user._id,
      };
      const data = req.body.data ? JSON.parse(req.body.data) : {};
      data.storyImg = req.body.storyImglink
        ? req.body.storyImglink
        : replaceS3BaseUrl(req.files?.storyImg[0].location);
      data.eventListBackgrnd = req.body.eventListBackgrndlink
        ? req.body.eventListBackgrndlink
        : replaceS3BaseUrl(req.files?.eventListBackgrnd[0].location);
      data.coverPic = coverPic;
      let Invites = await GetOne(condition);
      if (Invites) {
        Invites = await Update(condition, data);
      } else {
        data.userId = req.user._id;
        Invites = await Create(data);
      }
      if (Invites) {
        return res.status(200).send({
          success: true,
          message: "Guest Updated successfully",
          data: Invites,
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

  GetOneInvites: async function (req, res) {
    try {
      let condition;
      condition = {
        userId: req.query.id,
      };

      const Invites = await GetOne(condition);
      if (Invites) {
        return res.status(200).send({
          success: true,
          message: "Invites Fetched successfully",
          data: Invites,
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
};
