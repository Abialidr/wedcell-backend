var { GetOne, Update, Create } = require('../services/InvitesServices');
const FamilyServices = require('../../family/services/FamilyServices');
const GuestServices = require('../../guests/services/GuestServices');

var moment = require('moment');
module.exports = {
  UpdateInvites: async function (req, res) {
    try {
      const condition = {
        userId: req.user._id,
      };
      const data = req.body;
      let Invites = await GetOne(condition);
      if (Invites) {
        const isVis = Invites.eventID.every((item) =>
          req.body.eventID.includes(item)
        );
        if (isVis) {
          Invites = await Update(condition, data);
        } else {
          const Family = await FamilyServices.GetMany({ userID: req.user._id });
          const Guest = await GuestServices.GetMany(condition);
          let result;

          if (req.body.eventID.length === 0) {
            result = Invites.eventID;
          } else {
            result = Invites.eventID.filter(
              (item) => !req.body.eventID.includes(item)
            );
          }

          await Guest.map(async (data) => {
            const arr = data.Events;
            if (arr.length) {
              const fullArr = arr.filter((data) => !result.includes(data));
              let databaseArray = data.EventsAttendance;
              fullArr.forEach((id) => {
                if (!databaseArray.some((obj) => Object.keys(obj)[0] === id)) {
                  databaseArray.push({ [id]: '2' });
                }
              });
              databaseArray = databaseArray.filter((obj) =>
                fullArr.includes(Object.keys(obj)[0])
              );
              const arrdata = {
                Events: fullArr,
                EventsAttendance: databaseArray,
              };
              await GuestServices.Update({ _id: data._id }, arrdata);
            }
          });
          await Family.map(async (data) => {
            const arr = data.Events;
            if (arr.length) {
              const fullArr = arr.filter((data) => !result.includes(data));
              const arrdata = {
                Events: fullArr,
              };
              await FamilyServices.Update({ _id: data._id }, arrdata);
            }
          });
          Invites = await Update(condition, data);
        }
      } else {
        data.userId = req.user._id;
        Invites = await Create(data);
      }
      if (Invites) {
        return res.status(200).send({
          success: true,
          message: 'Invites Updated successfully',
          data: Invites,
        });
      }
    } catch (error) {
      console.error(
        `🚀 ~ file: CustomerControllers.js:64 ~ CreateAccount: ~ error:`,
        error
      );
      res.status(400).send({
        message: 'Something went wrong',
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
        ...(req.user._id ? { userId: req.user._id } : {}),
      };
      if (!condition?.userId) {
        return res.status(200).send({
          message: 'no Invites found',
          data: [],
          success: false,
        });
      }
      const Invites = await GetOne(condition);
      if (Invites) {
        return res.status(200).send({
          success: true,
          message: 'Invites Fetched successfully',
          data: Invites,
        });
      } else {
        return res.status(200).send({
          message: 'no Invites found',
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
        message: 'Something went wrong',
        error,
        data: [],
        success: false,
      });
    }
  },
  GetInvitesbyId: async function (req, res) {
    try {
      let condition;
      condition = {
        _id: req.params.id,
      };

      const Invites = await GetOne(condition);
      if (Invites) {
        return res.status(200).send({
          success: true,
          message: 'Invites Fetched successfully',
          data: Invites,
        });
      } else {
        return res.status(200).send({
          message: 'no Invites found',
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
        message: 'Something went wrong',
        error,
        data: [],
        success: false,
      });
    }
  },
  GetInvitesbyIdAndFindSize: async function (req, res) {
    try {
      let condition;
      condition = {
        _id: req.params.id,
      };

      const Invites = await GetOne(condition);
      console.log(`🚀 ~ file: InvitesControllers.js:165 ~ Invites:`, Invites);
      const size = new TextEncoder().encode(JSON.stringify(Invites)).length;
      const kiloBytes = size / 1024;
      const megaBytes = kiloBytes / 1024;
      return res.status(200).send({
        success: true,
        message: 'Invites Fetched successfully',
        megaBytes,
        kiloBytes,
      });
    } catch (error) {
      console.error(
        `🚀 ~ file: CustomerControllers.js:64 ~ CreateAccount: ~ error:`,
        error
      );
      res.status(400).send({
        message: 'Something went wrong',
        error,
        data: [],
        success: false,
      });
    }
  },
  GetInvitesFamilybyId: async function (req, res) {
    try {
      let condition;
      condition = {
        _id: req.params.id,
      };

      const Family = await FamilyServices.GetOne(condition);
      const Guest = await GuestServices.GetMany({ family: req.params.id });

      if (Family) {
        return res.status(200).send({
          success: true,
          message: 'Invites Fetched successfully',
          Family: Family,
          Guest: Guest,
        });
      } else {
        return res.status(200).send({
          message: 'no Invites found',
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
        message: 'Something went wrong',
        error,
        data: [],
        success: false,
      });
    }
  },
  GetOneInvitesforAdmin: async function (req, res) {
    try {
      let condition;
      condition = {
        userId: req.body.id,
      };

      const Invites = await GetOne(condition);
      if (Invites) {
        return res.status(200).send({
          success: true,
          message: 'Invites Fetched successfully',
          data: Invites,
        });
      } else {
        return res.status(200).send({
          message: 'no Invites found',
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
        message: 'Something went wrong',
        error,
        data: [],
        success: false,
      });
    }
  },
  UpdateInvitesforAdmin: async function (req, res) {
    try {
      const condition = {
        userId: req.query.id,
      };
      const data = req.body;
      let Invites = await GetOne(condition);
      if (Invites) {
        Invites = await Update(condition, data);
      } else {
        data.userId = req.query.id;
        Invites = await Create(data);
      }
      if (Invites) {
        return res.status(200).send({
          success: true,
          message: 'Invites Updated successfully',
          data: Invites,
        });
      }
    } catch (error) {
      console.error(
        `🚀 ~ file: CustomerControllers.js:64 ~ CreateAccount: ~ error:`,
        error
      );
      res.status(400).send({
        message: 'Something went wrong',
        error,
        data: [],
        success: false,
      });
    }
  },
};
