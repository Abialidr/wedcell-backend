var {
  GetOne,
  Update,
  GetMany,
  Create,
  countDocuments,
  Delete,
} = require('../services/GuestServices');
const FamilyServices = require('../../family/services/FamilyServices');
var GuestModel = require('../models/GuestModel');

var moment = require('moment');
module.exports = {
  CreateGuests: async function (req, res) {
    try {
      const condition = {
        _id: req.body.family,
      };
      const Family = await FamilyServices.GetOne(condition);
      data1 = req.body;
      if (!data1.name || !data1.group || !data1.menu || !data1.gender) {
        return res.status(400).send({
          success: false,
          message: 'invalid data',
          data: {},
        });
      }
      data1.userId = req.user._id;
      data1.attendence = '2';
      data1.inviteSent = false;
      data1.EventsAttendance = data1.Events.map((data) => {
        return {
          [data]: '2',
        };
      });
      const Guest1 = await Create(data1);
      const push = Family.Guest;
      const events = Family.Events;
      for (const value of data1.Events) {
        if (!events.includes(value)) {
          events.push(value);
        }
      }
      push.push(Guest1._id);
      const data2 = {
        Guest: push,
        Events: events,
      };
      await FamilyServices.Update(
        {
          _id: req.body.family,
        },
        data2
      );
      if (Guest1) {
        return res.status(200).send({
          success: true,
          message: 'Guest added successfully',
          data: Guest1,
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
  UpdateGuests: async function (req, res) {
    try {
      data = req.body;

      const condition = {
        _id: data.id,
      };
      const OneGuest = await GetOne(condition);
      if (!req.body.type || !req.body.type === 'NoFamily') {
        if (OneGuest.family === req.body.family) {
          if (req.body.family === '') {
            delete data.id;
            const Guest = await Update(condition, data);
            if (Guest) {
              return res.status(200).send({
                success: true,
                message: 'Guest Updated successfully',
                data: Guest,
              });
            }
          }
          const OneFamily = await FamilyServices.GetOne({
            _id: req.body.family,
          });
          const guestArray = OneFamily.Guest.filter(
            (data) => `${OneGuest._id}` != data
          );

          const getArray = await guestArray.map(async (data) => {
            const AllGuest = await GetOne({ _id: data });
            return AllGuest.Events;
          });
          const array = await Promise.all(getArray);
          const mergedArray = array.flat();
          const uniqueMergedArray = [...new Set(mergedArray)];
          for (const value of data.Events) {
            if (!uniqueMergedArray.includes(value)) {
              uniqueMergedArray.push(value);
            }
          }

          const data123 = {
            Events: uniqueMergedArray,
          };
          await FamilyServices.Update(
            {
              _id: req.body.family,
            },
            data123
          );
        } else {
          if (OneGuest.family === '') {
            const OneFamily1 = await FamilyServices.GetOne({
              _id: req.body.family,
            });

            const getArray1 = await OneFamily1.Guest.map(async (data) => {
              const AllGuest = await GetOne({ _id: data });
              return AllGuest.Events;
            });
            const array1 = await Promise.all(getArray1);
            const mergedArray1 = array1.flat();
            const uniqueMergedArray1 = [...new Set(mergedArray1)];
            for (const value of data.Events) {
              if (!uniqueMergedArray1.includes(value)) {
                uniqueMergedArray1.push(value);
              }
            }
            const guestArray1 = OneFamily1.Guest;
            guestArray1.push(OneGuest._id);
            const data1234 = {
              Guest: guestArray1,
              Events: uniqueMergedArray1,
            };

            await FamilyServices.Update(
              {
                _id: req.body.family,
              },
              data1234
            );
          } else if (!req.body.family) {
            const OneFamily = await FamilyServices.GetOne({
              _id: OneGuest.family,
            });
            const guestArray = OneFamily.Guest.filter(
              (data) => `${OneGuest._id}` != data
            );
            const getArray = await guestArray.map(async (data) => {
              const AllGuest = await GetOne({ _id: data });
              return AllGuest.Events;
            });
            const array = await Promise.all(getArray);
            const mergedArray = array.flat();
            const uniqueMergedArray = [...new Set(mergedArray)];

            const data123 = {
              Guest: guestArray,
              Events: uniqueMergedArray,
            };

            await FamilyServices.Update(
              {
                _id: OneFamily._id,
              },
              data123
            );
          } else {
            const OneFamily = await FamilyServices.GetOne({
              _id: OneGuest.family,
            });
            const guestArray = OneFamily.Guest.filter(
              (data) => `${OneGuest._id}` != data
            );
            const getArray = await guestArray.map(async (data) => {
              const AllGuest = await GetOne({ _id: data });
              return AllGuest.Events;
            });
            const array = await Promise.all(getArray);
            const mergedArray = array.flat();
            const uniqueMergedArray = [...new Set(mergedArray)];

            const data123 = {
              Guest: guestArray,
              Events: uniqueMergedArray,
            };

            await FamilyServices.Update(
              {
                _id: OneFamily._id,
              },
              data123
            );

            const OneFamily1 = await FamilyServices.GetOne({
              _id: req.body.family,
            });

            const getArray1 = await OneFamily1.Guest.map(async (data) => {
              const AllGuest = await GetOne({ _id: data });
              return AllGuest.Events;
            });
            const array1 = await Promise.all(getArray1);
            const mergedArray1 = array1.flat();
            const uniqueMergedArray1 = [...new Set(mergedArray1)];
            for (const value of data.Events) {
              if (!uniqueMergedArray1.includes(value)) {
                uniqueMergedArray1.push(value);
              }
            }
            const guestArray1 = OneFamily1.Guest;
            guestArray1.push(OneGuest._id);
            const data1234 = {
              Guest: guestArray1,
              Events: uniqueMergedArray1,
            };

            await FamilyServices.Update(
              {
                _id: req.body.family,
              },
              data1234
            );
          }
        }
      } else {
        delete data.id;
        let eventdata = OneGuest.EventsAttendance;
        if (req.body.attendevent) {
          const eventToUpdate = eventdata.find(
            (event) => Object.keys(event)[0] === req.body.eventId
          );
          eventToUpdate[req.body.eventId] = JSON.stringify(req.body.value);
        }
        data.EventsAttendance = eventdata;
        const Guest = await Update(condition, data);
        if (Guest) {
          return res.status(200).send({
            success: true,
            message: 'Guest Updated successfully',
            data: Guest,
          });
        }
      }
      let databaseArray = OneGuest.EventsAttendance;
      if (req.body.Events.length) {
        req.body.Events.forEach((id) => {
          if (!databaseArray.some((obj) => Object.keys(obj)[0] === id)) {
            databaseArray.push({ [id]: '2' });
          }
        });
        databaseArray = databaseArray.filter((obj) =>
          req.body.Events.includes(Object.keys(obj)[0])
        );
      }

      data.EventsAttendance = databaseArray;
      delete data.id;
      const Guest = await Update(condition, data);
      if (Guest) {
        return res.status(200).send({
          success: true,
          message: 'Guest Updated successfully',
          data: Guest,
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

  DeleteGuest: async function (req, res) {
    try {
      const condition = { _id: req.params.id };
      const Guest = await GetOne(condition);
      if (Guest.family) {
        const Family = await FamilyServices.GetOne({ _id: Guest.family });
        const guestArray = Family.Guest.filter(
          (data) => `${Guest._id}` != data
        );
        const getArray = await guestArray.map(async (data) => {
          const AllGuest = await GetOne({ _id: data });
          return AllGuest.Events;
        });
        const array = await Promise.all(getArray);
        const mergedArray = array.flat();
        const uniqueMergedArray = [...new Set(mergedArray)];
        const data = {
          Events: uniqueMergedArray,
          Guest: guestArray,
        };
        await FamilyServices.Update({ _id: Family._id }, data);
      }
      const deleted = await Delete(condition);
      if (deleted.n) {
        return res.status(200).send({
          success: true,
          message: 'Guest Deleted successfully',
          data: deleted,
        });
      } else {
        return res.status(200).send({
          success: false,
          message: 'Guest Deleted unsuccessfully',
          data: deleted,
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
  GetGuests: async function (req, res) {
    try {
      let condition;
      if (req.body.type === 'menu') {
        condition = {
          menu: req.body.category,
          userId: req.user._id,
        };
      }
      if (req.body.type === 'attendence') {
        condition = {
          attendence: req.body.category,
          userId: req.user._id,
        };
      }
      if (req.body.type === 'group') {
        condition = {
          group: req.body.category,
          userId: req.user._id,
        };
      }
      if (req.body.type === 'family') {
        condition = {
          family: req.body.category,
          userId: req.user._id,
        };
      }
      if (req.body.inviteSent !== undefined) {
        condition.inviteSent = req.body.inviteSent;
      }
      const Guests = await GetMany(condition);
      if (Guests.length) {
        return res.status(200).send({
          success: true,
          message: 'Guest Fetched successfully',
          data: Guests,
        });
      } else {
        return res.status(200).send({
          message: 'no Guests found',
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
  GetGuests1: async function (req, res) {
    try {
      let condition;
      let Guests = await req.body.category.map(async (category) => {
        if (req.body.type === 'menu') {
          condition = {
            menu: category,
            userId: req.user._id,
          };
        }
        if (req.body.type === 'attendence') {
          condition = {
            attendence: category,
            userId: req.user._id,
          };
        }
        if (req.body.type === 'group') {
          condition = {
            group: category,
            userId: req.user._id,
          };
        }
        if (req.body.type === 'family') {
          condition = {
            family: category,
            userId: req.user._id,
          };
        }
        if (req.body.inviteSent !== undefined) {
          condition.inviteSent = req.body.inviteSent;
        }
        const Guest = await GetMany(condition);

        return {
          [category]: Guest,
        };
      });
      Guests = await Promise.all(Guests);
      const GuestObj = {};

      Guests.forEach((obj) => {
        const key = Object.keys(obj)[0];

        GuestObj[key] = obj[key];
      });
      if (Guests.length) {
        return res.status(200).send({
          success: true,
          message: 'Guest Fetched successfully',
          data: GuestObj,
        });
      } else {
        return res.status(200).send({
          message: 'no Guests found',
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
  GetGuests2: async function (req, res) {
    try {
      if (req.query.category) {
        let condition;
        req.query.category = JSON.parse(req.query.category);
        let Guests = await req.query.category.map(async (category) => {
          if (req.query.type === 'menu') {
            condition = {
              menu: category,
              userId: req.user._id,
            };
          }
          if (req.query.type === 'attendence') {
            condition = {
              attendence: category,
              userId: req.user._id,
            };
          }
          if (req.query.type === 'group') {
            condition = {
              group: category,
              userId: req.user._id,
            };
          }
          if (req.query.type === 'family') {
            condition = {
              family: category,
              userId: req.user._id,
            };
          }
          if (req.query.inviteSent !== undefined) {
            condition.inviteSent = req.body.inviteSent;
          }
          const Guest = await GetMany(condition);

          return {
            [category]: Guest,
          };
        });
        Guests = await Promise.all(Guests);
        const GuestObj = {};

        Guests.forEach((obj) => {
          const key = Object.keys(obj)[0];

          GuestObj[key] = obj[key];
        });
        if (Guests.length) {
          return res.status(200).send({
            success: true,
            message: 'Guest Fetched successfully',
            data: GuestObj,
          });
        } else {
          return res.status(200).send({
            message: 'no Guests found',
            data: [],
            success: false,
          });
        }
      }
      else{
        return false
      }
    } catch (error) {
      console.error(
        `🚀 ~ file: CustomerCodfgdfdfntrollers.js:64 ~ CreateAccount: ~ error:`,
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
  genderGuest: async function (req, res) {
    try {
      const condition1 = {
        gender: 'Male',
        userId: req.user._id,
      };
      const condition2 = {
        gender: 'Female',
        userId: req.user._id,
      };
      const condition3 = {
        gender: 'Male-child',
        userId: req.user._id,
      };
      const condition4 = {
        gender: 'Female-child',
        userId: req.user._id,
      };

      const Male = await countDocuments(condition1);
      const Female = await countDocuments(condition2);
      const Malechild = await countDocuments(condition3);
      const Femalechild = await countDocuments(condition4);

      if (
        Male !== undefined &&
        Female !== undefined &&
        Malechild !== undefined &&
        Femalechild !== undefined
      ) {
        return res.status(200).send({
          success: true,
          message: 'successfully',
          data: {
            Male,
            Female,
            Malechild,
            Femalechild,
          },
        });
      } else {
        return res.status(400).send({
          message: 'invalid id',
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
  apdGuest: async function (req, res) {
    try {
      const condition1 = {
        attendence: 0,
        userId: req.user._id,
      };
      const condition2 = {
        attendence: 1,
        userId: req.user._id,
      };
      const condition3 = {
        attendence: 2,
        userId: req.user._id,
      };

      const decline = await countDocuments(condition1);
      const attending = await countDocuments(condition2);
      const pending = await countDocuments(condition3);

      if (
        decline !== undefined &&
        attending !== undefined &&
        pending !== undefined
      ) {
        return res.status(200).send({
          success: true,
          message: 'successfully',
          data: {
            decline,
            attending,
            pending,
          },
        });
      } else {
        return res.status(400).send({
          message: 'invalid id',
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
  invitesentGuest: async function (req, res) {
    try {
      const condition1 = {
        inviteSent: true,
        userId: req.user._id,
      };
      const condition2 = {
        inviteSent: false,
        userId: req.user._id,
      };

      const sent = await countDocuments(condition1);
      const not_sent = await countDocuments(condition2);

      if (sent !== undefined && not_sent !== undefined) {
        return res.status(200).send({
          success: true,
          message: 'successfully',
          data: {
            sent,
            not_sent,
          },
        });
      } else {
        return res.status(400).send({
          message: 'invalid id',
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
  atGuest: async function (req, res) {
    try {
      const condition1 = {
        attendence: 1,
        userId: req.user._id,
      };
      const condition2 = {
        userId: req.user._id,
      };

      const attending = await countDocuments(condition1);
      const total = await countDocuments(condition2);

      if (attending !== undefined && total !== undefined) {
        return res.status(200).send({
          success: true,
          message: 'successfully',
          data: {
            attending,
            total,
          },
        });
      } else {
        return res.status(400).send({
          message: 'invalid id',
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
  groupsGuest: async function (req, res) {
    try {
      if (req.body.guest === undefined || !req.body.guest.length) {
        return res.status(400).send({
          success: false,
          message: 'invalid data',
          data: {},
        });
      }

      let guests = req.body.guest.map(async (data) => {
        const condition = {
          userId: req.user._id,
          group: data,
        };
        const condition1 = {
          attendence: 0,
          userId: req.user._id,
          group: data,
        };
        const condition2 = {
          attendence: 1,
          userId: req.user._id,
          group: data,
        };
        const condition3 = {
          attendence: 2,
          userId: req.user._id,
          group: data,
        };
        const total = await countDocuments(condition);
        const decline = await countDocuments(condition1);
        const attending = await countDocuments(condition2);
        const pending = await countDocuments(condition3);
        return {
          name: data,
          data: [
            {
              name: 'decline',
              data: [decline],
            },
            {
              name: 'attending',
              data: [attending],
            },
            {
              name: 'pending',
              data: [pending],
            },
          ],
          total,
        };
      });
      guests = await Promise.all(guests);

      if (guests.length) {
        return res.status(200).send({
          success: true,
          message: 'successfully',
          data: guests,
        });
      } else {
        return res.status(400).send({
          message: 'invalid id',
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
  groupsGuest1: async function (req, res) {
    try {
      req.query.guest = JSON.parse(req.query.guest);
      if (req.query.guest === undefined || !req.query.guest.length) {
        return res.status(400).send({
          success: false,
          message: 'invalid data',
          data: {},
        });
      }

      let guests = req.query.guest.map(async (data) => {
        const condition = {
          userId: req.user._id,
          group: data,
        };
        const condition1 = {
          attendence: 0,
          userId: req.user._id,
          group: data,
        };
        const condition2 = {
          attendence: 1,
          userId: req.user._id,
          group: data,
        };
        const condition3 = {
          attendence: 2,
          userId: req.user._id,
          group: data,
        };
        const total = await countDocuments(condition);
        const decline = await countDocuments(condition1);
        const attending = await countDocuments(condition2);
        const pending = await countDocuments(condition3);
        return {
          name: data,
          data: [
            {
              name: 'decline',
              data: [decline],
            },
            {
              name: 'attending',
              data: [attending],
            },
            {
              name: 'pending',
              data: [pending],
            },
          ],
          total,
        };
      });
      guests = await Promise.all(guests);

      if (guests.length) {
        return res.status(200).send({
          success: true,
          message: 'successfully',
          data: guests,
        });
      } else {
        return res.status(400).send({
          message: 'invalid id',
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
  menuGuest: async function (req, res) {
    try {
      if (req.body.menu === undefined || !req.body.menu.length) {
        return res.status(400).send({
          success: false,
          message: 'invalid data',
          data: {},
        });
      }

      let menu = req.body.menu.map(async (data) => {
        const condition = {
          userId: req.user._id,
          menu: data,
        };

        const total = await countDocuments(condition);

        return {
          name: data,
          data: [total],
        };
      });
      menu = await Promise.all(menu);
      const condition = {
        userId: req.user._id,
      };

      const total = await countDocuments(condition);
      if (menu.length) {
        return res.status(200).send({
          success: true,
          message: 'successfully',
          data: { menu, total },
        });
      } else {
        return res.status(400).send({
          message: 'invalid id',
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
  menuGuest1: async function (req, res) {
    try {
      if (req.query.menu !== undefined) {
        req.query.menu = JSON.parse(req.query.menu);
        if (req.query.menu === undefined || !req.query.menu.length) {
          return res.status(400).send({
            success: false,
            message: 'invalid data',
            data: {},
          });
        }
        let menu = req.query.menu.map(async (data) => {
          const condition = {
            userId: req.user._id,
            menu: data,
          };

          const total = await countDocuments(condition);

          return {
            name: data,
            data: [total],
          };
        });
        menu = await Promise.all(menu);
        const condition = {
          userId: req.user._id,
        };

        const total = await countDocuments(condition);
        if (menu.length) {
          return res.status(200).send({
            success: true,
            message: 'successfully',
            data: { menu, total },
          });
        } else {
          return res.status(400).send({
            message: 'invalid id',
            data: [],
            success: false,
          });
        }
      } else {
        return res.status(400).send({
          success: false,
          message: 'invalid data',
          data: {},
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
  AttendanceGuest: async function (req, res) {
    try {
      const documents = await GetMany({ userId: req.user._id });

      const idCounts = {};
      documents.map((doc) => {
        doc.EventsAttendance.map((event) => {
          const id = Object.keys(event)[0];
          const status = event[id];

          if (!idCounts[id]) {
            idCounts[id] = {
              attending: 0,
              pending: 0,
              notAttending: 0,
              count: 0,
            };
          }
          switch (status) {
            case '1':
              idCounts[id].attending++;
              break;
            case '2':
              idCounts[id].pending++;
              break;
            case '0':
              idCounts[id].notAttending++;
              break;
          }

          // Update the total count for the ID
          idCounts[id].count++;
        });
      });

      const formattedResult = Object.keys(idCounts).map((id) => ({
        [id]: idCounts[id],
      }));
      res.send({
        data: formattedResult,
      });
    } catch (error) {
      console.error(
        `🚀 ~ file: CustomerControllers.js:64 ~ CreateAccounZXZXZXZXt: ~ error:`,
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
  InviteGuest: async function (req, res) {
    try {
      let documents = await GetMany({ userId: req.user._id });
      const idCounts = {};
      documents = documents.filter((data2) =>
        data2.Events.includes(req.body.eventsId)
      );
      console.log(`🚀 ~ file: GuestControllers.js:878 ~ documents:`, documents);
      res.send({
        data: documents,
      });
    } catch (error) {
      console.error(
        `🚀 ~ file: CustomerControllers.js:64 ~ CreateAccounZXZXZXZXt: ~ error:`,
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
  InviteGuest1: async function (req, res) {
    try {
      let documents = await GetMany({ userId: req.user._id });
      documents = documents.filter((data2) =>
        data2.Events.includes(req.query.eventsId)
      );
      res.send({
        data: documents,
      });
    } catch (error) {
      console.error(
        `🚀 ~ file: CustomerControllers.js:64 ~ CreateAccounZXZXZXZXt: ~ error:`,
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
