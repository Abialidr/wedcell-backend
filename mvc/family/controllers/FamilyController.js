var {
  GetOne,
  Update,
  Create,
  GetMany,
  Delete,
} = require("../services/FamilyServices");
const GuestServices = require("../../guests/services/GuestServices");
var axios = require("axios");

var moment = require("moment");
module.exports = {
  CreateFamilys: async function (req, res) {
    try {
      const data = {
        userID: req.user._id,
        FamilyName: req.body.name,
        FamilyContact: req.body.contact,
      };
      const Family = await Create(data);

      return res.status(200).send({
        success: true,
        message: "Image Upload successfully",
        data: Family,
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
  RsvpFamilyInfo: async function (req, res) {
    try {
      const data = {
        _id: req.params.id,
      };
      const data1 = {
        Attending: req.body.rsvp,
      };
      const Family = await Update(data, data1);
      const Hello = await Family.Guest.map(async (data) => {
        return await GuestServices.GetOne({ _id: data });
      });
      const hii = await Promise.all(Hello);

      return res.status(200).send({
        success: true,
        message: "Rsvp Done",
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
  GetFamily: async function (req, res) {
    try {
      let condition;
      condition = {
        userID: req.user._id,
      };
      console.log(
        `🚀 ~ file: FamilyController.js:76 ~ req.user._id:`,
        req.user._id
      );

      const Family = await GetMany(condition);
      if (Family) {
        return res.status(200).send({
          success: true,
          message: "Family Fetched successfully",
          data: Family,
        });
      } else {
        return res.status(200).send({
          message: "no Family found",
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
  GetbyNameFamily: async function (req, res) {
    try {
      let condition;
      condition = {
        _id: req.query.id,
      };

      const Family = await GetOne(condition);
      const familybyName = await Family.Guest.map(async (data) => {
        const hello = await GuestServices.GetOne({ _id: data });
        return hello;
      });

      const Guest = await Promise.all(familybyName);
      if (Guest) {
        return res.status(200).send({
          success: true,
          message: "Family Fetched successfully",
          data: Guest,
        });
      } else {
        return res.status(200).send({
          message: "no Family found",
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
  DeleteFamily: async function (req, res) {
    try {
      const condition = {
        _id: req.params.id,
      };
      const Family = await GetOne(condition);
      await Family.Guest.map(async (data) => {
        const data1 = {
          Events: [],
          family: "",
        };
        await GuestServices.Update({ _id: data }, data1);
      });
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
  sendMessageOneonOne: async function (req, res) {
    try {
      const Family = await GetOne({ _id: req.body.id });
      if (!Family?.InviteSent) {
        const hello = await axios.get(
          `https://apicloudstack.com/api/send?number=91${Family?.FamilyContact}&type=text&message=this is test messae %0A from wedcell %0A https://wedcell.com/InvitationCard?id=${req.body.inviteId}%26FamilyId=${Family?._id} &instance_id=${process.env.WHATSAPP_INSTANCE_ID}&access_token=${process.env.WHATSAPP_ACCES_TOKEN}`
        );
        if (hello?.data?.status === "success") {
          await Update({ _id: Family?._id }, { InviteSent: true });
        }
        return hello?.data;
      }
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
  sendMessageToAll: async function (req, res) {
    try {
      const Family = await GetMany({ userID: req.user._id });
      // const contact = Family?.map((data) => {
      //   return data?.FamilyContact;
      // });
      let responce = Family?.map(async (data) => {
        console.log(
          "🚀 ~ file: FamilyController.js:186 ~ responce ~ data:",
          data
        );
        if (!data?.InviteSent) {
          const hello = await axios.get(
            `https://apicloudstack.com/api/send?number=91${data?.FamilyContact}&type=text&message=this is test messae %0A from wedcell %0A https://wedcell.com/InvitationCard?id=${req.body.inviteId}%26FamilyId=${data?._id} &instance_id=${process.env.WHATSAPP_INSTANCE_ID}&access_token=${process.env.WHATSAPP_ACCES_TOKEN}`
          );
          if (hello?.data?.status === "success") {
            await Update({ _id: data?._id }, { InviteSent: true });
          }
          return hello?.data;
        }
      });
      responce = await Promise.all(responce);
      console.log(
        "🚀 ~ file: FamilyController.js:199 ~ responce ~ responce:",
        responce
      );
      responce = responce.map((data) => data.data);
      console.log(`🚀 ~ file: FamilyController.js:191 ~ responce:`, responce);
      res.status(200).send({
        data: responce,
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
