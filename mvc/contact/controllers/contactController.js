const { default: axios } = require("axios");
const contactModel = require("../models/contactModel");
const messageModal = require("../models/messageModel");
const groupMessageModel = require("../models/groupMessageModel");
const messageModel = require("../models/messageModel");
const realMessageModel = require("../models/realMessageModel");
var ContactServices = require("../services/contactServices");
const aws = require("aws-sdk");
require("dotenv/config");
const moment = require("moment/moment");
const mongoose = require("mongoose");
const realGroupMessageModel = require("../models/realGroupMessageModel");
const CustomerModels = require("../../customer/models/CustomerModels");
const VenueUserModels = require("../../venue user/models/VenueUserModels");
const VendorUserModels = require("../../vendor user/models/VendorUserModels");
const ShopNowUserModels = require("../../shop now user/models/ShopNowUserModels");
const { replaceS3BaseUrl } = require("../../../utils");

module.exports = {
  AddContact: async function (req, res) {
    var data = req.body;
    let condition = {
      prospectId: data.prospectId,
      vendorId: data.vendorId,
    };
    try {
      const isContact = await contactModel.find(condition);
      const isMessage = await messageModal.find(condition);
      console.log(
        "🚀 ~ file: contactController.js:27 ~ isContact:",
        isContact,
        isMessage
      );
      if (!isContact.length) {
        const result = await ContactServices.AddContact(data);
        console.log("🚀 ~ file: contactController.js:29 ~ result:", result);
        if (req.body.IsWedcell) {
          const result2 = await ContactServices.AddMessage(data);
          console.log("🚀 ~ file: contactController.js:31 ~ result2:", result2);
          const message = `${req.body.prospectName} were trying to contact you, Here is ${req.body.prospectName}'s Number’s ${req.body.prospectContact} Best Regards WedCell Team`;
          const message2 = `You Were trying contact ${req.body.vendorName}. Here is ${req.body.vendorName}'s Number’s ${req.body.vendorContact} Best Regards WedCell Team`;
          // var url = `https://apicloudstack.com/api/send?number=${
          //   req.body.vendorContact
          // }&type=text&message=${message} &instance_id=${"65F137DB8BC0D"}&access_token=${
          //   process.env.WHATSAPP_ACCES_TOKEN
          // }`;
          // var url2 = `https://apicloudstack.com/api/send?number=${
          //   req.body.prospectContact
          // }&type=text&message=${message2} &instance_id=${"65F137DB8BC0D"}&access_token=${
          //   process.env.WHATSAPP_ACCES_TOKEN
          // }`;
          const url =
            "http://makemysms.in/api/sendsms.php?username=wedcell&password=01679b59&sender=WEDCEL" +
            "&mobile=91" +
            req.body.vendorContact +
            "&type=1&product=1&template=1707163867867832694" +
            "&message=" +
            message;
          // let isSuccess = true;
          // while (isSuccess === true) {
          //   const result = await axios.get(url);
          //   isSuccess =
          //     result?.data.length === 0
          //       ? "other"
          //       : result?.data?.status
          //       ? false
          //       : true;
          // }
          // if (isSuccess === "other") {
          //   return res.status(400).send({
          //     success: false,
          //     message: "something went wrong",
          //   });
          // }
          // let isSuccess2 = false;
          // while (isSuccess2 === true) {
          //   const result = await axios.get(url2);

          //   isSuccess2 =
          //     result?.data.length === 0
          //       ? "other"
          //       : result?.data?.status
          //       ? false
          //       : true;
          // }
          // if (isSuccess2 === "other") {
          //   return res.status(400).send({
          //     success: false,
          //     message: "something went wrong",
          //   });
          // }
        }
        res.status(200).send({
          success: true,
          message: "sent",
        });
      } else {
        res.status(201).send({
          success: true,
          data: isMessage,
          message: "already sent",
        });
      }
    } catch (error) {
      console.log("🚀 ~ file: contactController.js:106 ~ error:", error);
      return res.json(error);
    }
  },
  AddContactFromVendor: async function (req, res) {
    var data = req.body;
    try {
      const result = await ContactServices.AddContact(data);
      res.status(200).send({
        success: true,
        message: "sent",
        data: result,
      });
    } catch (error) {
      return res.json(error);
    }
  },
  UpdateContact: async function (req, res) {
    var data = req.body;
    try {
      const isContact = await contactModel.findByIdAndUpdate(data.id, data);
      res.status(200).send({
        success: true,
        message: "sent",
        data: isContact,
      });
    } catch (error) {
      return res.json(error);
    }
  },

  CreateGroup: async function (req, res) {
    var data = req.body;
    try {
      let arrayOfIds = data.vendorInfo.map((obj) =>
        mongoose.Types.ObjectId(obj.vendorId)
      );
      arrayOfIds.push(mongoose.Types.ObjectId(data.prospectId));
      data.currentUsers = arrayOfIds;
      const result = await ContactServices.AddGroupMessage(data);
      return res.status(200).send(result.data);
    } catch (error) {
      return res.json(error);
    }
  },
  AddToGroup: async function (req, res) {
    var data = req.body;

    try {
      //   const result = await groupMessageModel.findById(req.body._id)
      // //   const result = await ContactServices.AddGroupMessage(data);
      //   if(result){
      const result1 = await groupMessageModel.updateOne(
        { _id: req.body._id },
        {
          $push: {
            vendorInfo: { $each: req.body.vendorInfo },
            currentUsers: {
              $each: req.body.vendorInfo.map((obj) =>
                mongoose.Types.ObjectId(obj.vendorId)
              ),
            },
          },
        },
        { new: true }
      );
      // }
      return res.status(200).send({
        success: true,
      });
    } catch (error) {
      return res.json(error);
    }
  },
  RenameGroup: async function (req, res) {
    var data = req.body;

    try {
      //   const result = await groupMessageModel.findById(req.body._id)
      // //   const result = await ContactServices.AddGroupMessage(data);
      //   if(result){
      const result1 = await groupMessageModel.updateOne(
        { _id: req.body._id },
        { groupName: data.groupName },
        { new: true }
      );
      // }
      return res.status(200).send({
        success: true,
      });
    } catch (error) {
      return res.json(error);
    }
  },
  RemoveFromGroup: async function (req, res) {
    const { _id, vendorId } = req.body;

    try {
      const result = await groupMessageModel.updateOne(
        { _id },
        {
          $pull: {
            currentUsers: vendorId,
          },
          $push: {
            previousUsers: {
              id: vendorId,
              isActive: false,
              leaveTime: new Date(),
            },
          },
        }
      );

      if (result.nModified > 0) {
        // User was successfully marked as inactive in the group chat
        return res.status(200).send({
          success: true,
        });
      } else {
        // User not found in the group chat or already marked as inactive
        return res.status(400).send({
          success: false,
          message: "User not found in the group chat or already removed.",
        });
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  LeaveFromGroup: async function (req, res) {
    const { _id, prospectId } = req.body;

    try {
      const result = await groupMessageModel.updateOne(
        { _id },
        {
          $pull: {
            currentUsers: req.user._id,
          },
          $addToSet: {
            previousUsers: {
              id: prospectId,
              isActive: false,
              leaveTime: new Date(),
            },
          },
        }
      );
      if (result.nModified > 0) {
        // User was successfully marked as inactive in the group chat
        return res.status(200).send({
          success: true,
        });
      } else {
        // User not found in the group chat or already marked as inactive
        return res.status(400).send({
          success: false,
          message: "User not found in the group chat or already removed.",
        });
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  GetAll: async function (req, res) {
    const condition = {};
    if (req.body.vendorId) {
      condition.vendorId = req.body.vendorId;
      const result = await messageModel
        .find(condition)
        .select("prospectId prospectName prospectImage");
      const result2 = await groupMessageModel
        .find({
          currentUsers: { $in: [req.body.vendorId] },
        })
        .select("_id groupName currentUsers");
      let final = [...result2, ...result];
      return res.json(final);
    }
    if (req.body.prospectId) {
      condition.prospectId = req.body.prospectId;
      const result = await messageModel
        .find(condition)
        .select("vendorId vendorName vendorImage");
      const result2 = await groupMessageModel
        .find(condition)
        .select("_id groupName currentUsers");
      let final = [...result2, ...result];
      return res.json(final);
    }

    // })
    // .catch(function (error) {
    //   return res.json(error);
    // });
  },
  GetAll1: async function (req, res) {
    try {
      const condition = {};
      if (req.query.vendorId) {
        condition.vendorId = req.query.vendorId;
        const result = await messageModel
          .find(condition)
          .select("prospectId prospectName prospectImage");
        const result2 = await groupMessageModel
          .find({
            currentUsers: { $in: [req.query.vendorId] },
          })
          .select("_id groupName currentUsers");
        let final = [...result2, ...result];
        return res.json(final);
      }
      if (req.query.prospectId) {
        condition.prospectId = req.query.prospectId;
        const result = await messageModel
          .find(condition)
          .select("vendorId vendorName vendorImage");
        const result2 = await groupMessageModel
          .find(condition)
          .select("_id groupName currentUsers");
        let final = [...result2, ...result];
        return res.json(final);
      }
    } catch (e) {}

    // })
    // .catch(function (error) {
    //   return res.json(error);
    // });
  },
  GetContacts: async function (req, res) {
    console.log(req.body);
    const condition = {};
    if (req.body.vendorId) {
      condition.vendorId = req.body.vendorId;
    }
    if (req.body.prospectId) {
      condition.prospectId = req.body.prospectId;
    }
    const result = await contactModel.find(condition);

    return res.json(result);
    // })
    // .catch(function (error) {
    //   return res.json(error);
    // });
  },
  GetContacts1: async function (req, res) {
    const condition = {};
    const page = req.query.page ? req.query.page : 0;
    if (req.query.prospectId) {
      condition.prospectId = req.query.prospectId;
    }
    if (req.query.vendorId) {
      condition.vendorId = req.query.vendorId;
    }
    if (req.query.id) {
      condition._id = req.query.id;
    }
    const result = await contactModel.find(condition);

    return res.json(result);
    // })
    // .catch(function (error) {
    //   return res.json(error);
    // });
  },
  GetVendorsContacts1: async function (req, res) {
    const condition = {};
    const page = req.query.page ? req.query.page : 1;
    if (req.query.prospectId) {
      condition.prospectId = req.query.prospectId;
    }
    if (req.query.vendorId) {
      condition.vendorId = req.query.vendorId;
    }
    if (req.query.id) {
      condition._id = req.query.id;
    }
    if (req.query.status) {
      condition.Status = req.query.status;
    }
    if (req.query.time) {
      const currentTime = moment(); // Current date and time

      switch (req.query.time) {
        case "6 months":
          condition.LastInteraction = {
            $gte: currentTime
              .subtract(6, "months")
              .startOf("day")
              .toISOString(),
          };
          break;
        case "this month":
          condition.LastInteraction = {
            $gte: currentTime.startOf("month").startOf("day").toISOString(),
            $lte: currentTime.endOf("month").endOf("day").toISOString(),
          };
          break;
        case "this week":
          condition.LastInteraction = {
            $gte: currentTime.startOf("week").startOf("day").toISOString(),
            $lte: currentTime.endOf("week").endOf("day").toISOString(),
          };
          break;
        case "24 hours":
          condition.LastInteraction = {
            $gte: currentTime.subtract(24, "hours").toISOString(),
            $lte: currentTime.add(24, "hours").toISOString(),
          };
          break;
        case "Custom":
          condition.LastInteraction = {
            $gte: req.query.startTime,
            $lte: req.query.endTime,
          };
          break;
        default:
          break;
      }
    }
    if (req.query.search) {
      condition.prospectName = { $regex: req.query.search, $options: "i" };
    }
    const result = await contactModel
      .find(condition)
      .sort({
        createdAt: -1,
      })
      .skip((page - 1) * 5)
      .limit(5);
    const total = await contactModel.countDocuments(condition);

    return res.status(200).send({
      data: result,
      total,
      totalPage: Math.ceil(total / 5),
      page: page,
      pageSize: result.length,
      message: "Leads fetched successfully",
      success: true,
    });
  },
  GetSingleContact: async function (req, res) {
    console.log(req.body);
    const condition = {};

    const result = await contactModel.find({
      prospectId: req.body.prospectId,
      vendorId: req.body.vendorId,
    });

    return res.json(result);
    // })
    // .catch(function (error) {
    //   return res.json(error);
    // });
  },
  GetSingleContact1: async function (req, res) {
    const condition = {};

    const result = await contactModel.find({
      prospectId: req.query.prospectId,
      vendorId: req.query.vendorId,
    });

    return res.json(result);
    // })
    // .catch(function (error) {
    //   return res.json(error);
    // });
  },
  GetMessageByTwoId: async function (req, res) {
    const condition = {};

    const result = await messageModel.find({
      prospectId: req.body.prospectId,
      vendorId: req.body.vendorId,
    });

    return res.json(result);
    // })
    // .catch(function (error) {
    //   return res.json(error);
    // });
  },
  GetMessages: function (req, res) {
    const condition = {
      vendorType: {
        $ne: "admin",
      },
    };
    if (req.body.vendorId) {
      condition.vendorId = req.body.vendorId;
    }
    if (req.body.prospectId) {
      condition.prospectId = req.body.prospectId;
    }
    console.log("🚀 ~ condition:", condition);
    ContactServices.GetMessages(condition, req.user._id)
      .then(function (result) {
        return res.json(result);
      })
      .catch(function (error) {
        return res.json(error);
      });
  },
  GetMessagesForAdmin: async function (req, res) {
    if (req.body.type === "dm") {
      const ress = await messageModel
        .find({ vendorType: "admin" })
        .skip(req.body.skip)
        .limit(req.body.limit);

      const total = await messageModel.countDocuments({
        vendorType: "admin",
      });
      return res.status(200).send({
        data: ress,
        message: "received successfully",
        success: true,
        total,
        totalPages: Math.ceil(total / req.body.limit),
      });
    }
    if (req.body.type === "msg") {
      const ress = await messageModel
        .find({ vendorType: { $ne: "admin" } })
        .skip(req.body.skip)
        .limit(req.body.limit);

      const total = await messageModel.countDocuments({
        vendorType: { $ne: "admin" },
      });
      return res.status(200).send({
        data: ress,
        message: "received successfully",
        success: true,
        total,
        totalPages: Math.ceil(total / req.body.limit),
      });
    }
    if (req.body.type === "grpmsg") {
      const ress = await groupMessageModel
        .find()
        .skip(req.body.skip)
        .limit(req.body.limit);

      const total = await groupMessageModel.countDocuments({});
      return res.status(200).send({
        data: ress,
        message: "received successfully",
        success: true,
        total,
        totalPages: Math.ceil(total / req.body.limit),
      });
    }
    const condition = {
      vendorType: {
        $ne: "admin",
      },
    };
    if (req.body.vendorId) {
      condition.vendorId = req.body.vendorId;
    }
    if (req.body.prospectId) {
      condition.prospectId = req.body.prospectId;
    }
    console.log("🚀 ~ condition:", condition);
    ContactServices.GetMessages(condition, req.user._id)
      .then(function (result) {
        return res.json(result);
      })
      .catch(function (error) {
        return res.json(error);
      });
  },
  GetMessages1: function (req, res) {
    const condition = {
      vendorType: {
        $ne: "admin",
      },
    };
    if (req.query.vendorId) {
      condition.vendorId = req.query.vendorId;
    }
    if (req.query.prospectId) {
      condition.prospectId = req.query.prospectId;
    }
    ContactServices.GetMessages(condition, req.user._id)
      .then(function (result) {
        return res.json(result);
      })
      .catch(function (error) {
        return res.json(error);
      });
  },
  GetSingleMessage: async function (req, res) {
    // let condition = {
    //   vendorId: req.header("vendorId"),
    // };
    try {
      console.log("🚀 ~ req.body.type:", req.body.type);
      const f = async (ress, res, is = false) => {
        const res2 = await realMessageModel
          .find({ message_parent_id: ress.data._id })
          .skip((req.body.page - 1) * 50)
          .limit(50)
          .sort({
            timestamp: -1,
          });
        const total = await realMessageModel.countDocuments({
          message_parent_id: ress.data._id,
        });
        ress.data.messages = res2.reverse();
        return res.status(200).send({
          data: ress.data,
          message: "Contacts received successfully",
          ...(is ? { newUser: ress.data._id } : {}),
          success: true,
          total,
          totalPages: Math.ceil(total / 50),
        });
      };
      if (req.body.id == "648d3c8efb95751e4d881bee") {
        let d;
        if (req.body.type === "prospect") {
          d = await messageModel.findOne({
            prospectId: req.user._id,
            vendorId: req.body.id,
          });
        } else {
          d = await messageModel.findOne({
            prospectId: req.body.id,
            vendorId: req.user._id,
          });
        }
        console.log("🚀 ~ sasad:", d);
        if (!d) {
          if (req.body.type === "prospect") {
            const user = await CustomerModels.findById(req.user._id);
            const data = {
              initiatorId: req.user._id,
              prospectName: user.name,
              prospectId: req.user._id,
              prospectContact: user.mobile,
              prospectImage: "",
              vendorName: "Wedcell Admin",
              vendorId: "648d3c8efb95751e4d881bee",
              vendorContact: "919910990378",
              vendorImage: "",
              vendorType: "admin",
            };
            d = await ContactServices.AddMessage(data);
          } else if (req.body.type === "Vendor") {
            const user = await VendorUserModels.findById(req.user._id);
            const data = {
              initiatorId: "648d3c8efb95751e4d881bee",
              prospectName: "Wedcell Admin",
              prospectId: "648d3c8efb95751e4d881bee",
              prospectContact: "919910990378",
              prospectImage:
                "https://wedcell.s3.ap-south-1.amazonaws.com/public/images/webp/Group%204.webp",
              vendorName: user.name,
              vendorId: req.user._id,
              vendorContact: user.contactPhone,
              vendorImage: user.mainImage,
              vendorType: "admin",
            };
            d = await ContactServices.AddMessage(data);
          } else if (req.body.type === "Venue") {
            const user = await VenueUserModels.findById(req.user._id);
            const data = {
              initiatorId: "648d3c8efb95751e4d881bee",
              prospectName: "Wedcell Admin",
              prospectId: "648d3c8efb95751e4d881bee",
              prospectContact: "919910990378",
              prospectImage:
                "https://wedcell.s3.ap-south-1.amazonaws.com/public/images/webp/Group%204.webp",
              vendorName: user.name,
              vendorId: req.user._id,
              vendorContact: user.contactPhone,
              vendorImage: user.mainImage,
              vendorType: "admin",
            };
            d = await ContactServices.AddMessage(data);
          } else if (req.body.type === "ShopNow") {
            const user = await ShopNowUserModels.findById(req.user._id);
            const data = {
              initiatorId: "648d3c8efb95751e4d881bee",
              prospectName: "Wedcell Admin",
              prospectId: "648d3c8efb95751e4d881bee",
              prospectContact: "919910990378",
              prospectImage:
                "https://wedcell.s3.ap-south-1.amazonaws.com/public/images/webp/Group%204.webp",
              vendorName: user.name,
              vendorId: req.user._id,
              vendorContact: user.mobile,
              vendorImage: user.profile_pic,
              vendorType: "admin",
            };
            d = await ContactServices.AddMessage(data);
          }
        }
        d = {
          data: d,
        };
        console.log("🚀 ~ d:", d);
        return f(d, res, true);
      } else {
        const ress = await ContactServices.GetSingleMessage(
          req.body.id,
          req.user._id
        );
        f(ress, res);
      }
    } catch (e) {
      res.status(400).send(e);
    }
    // ContactServices.GetSingleMessage(req.body.id, req.user._id)
    //   .then(function (result) {
    //     res.json(result);
    //   })
    //   .catch(function (error) {
    //     res.json(error);
    //   });
  },
  GetSingleMessage1: function (req, res) {
    // let condition = {
    //   vendorId: req.header("vendorId"),
    // };
    ContactServices.GetSingleMessage(req.query.id, req.user._id)
      .then(function (result) {
        res.json(result);
      })
      .catch(function (error) {
        res.json(error);
      });
  },
  GetGroupMessages: function (req, res) {
    const condition = {};
    if (req.body.vendorId) {
      condition.vendorId = req.body.vendorId;
    }
    if (req.body.prospectId) {
      condition.prospectId = req.body.prospectId;
    }
    ContactServices.GetGroupMessages(condition, req.user._id)
      .then(function (result) {
        return res.json(result);
      })
      .catch(function (error) {
        return res.json(error);
      });
  },
  GetGroupMessages1: function (req, res) {
    const condition = {};
    if (req.query.vendorId) {
      condition.vendorId = req.query.vendorId;
    }
    if (req.query.prospectId) {
      condition.prospectId = req.query.prospectId;
    }
    ContactServices.GetGroupMessages(condition, req.user._id)
      .then(function (result) {
        return res.json(result);
      })
      .catch(function (error) {
        return res.json(error);
      });
  },
  GetSingleGroupMessage: async function (req, res) {
    // let condition = {
    //   vendorId: req.header("vendorId"),
    // };
    const id = "";
    groupMessageModel.findById(req.query?.id, async (err, groupMessage) => {
      if (err) {
        // Handle the error
        return res.status(500).json({ error: "An error occurred" });
      }

      if (!groupMessage) {
        // Handle the case where the group message with the given ID was not found
        return res.status(404).json({ error: "Group message not found" });
      }

      const isCurrentUser = groupMessage.currentUsers.includes(req.user._id);
      const previousUser = groupMessage.previousUsers.find(
        (user) => user.id.toString() === req.user._id && user.leaveTime
      );
      if (isCurrentUser || req.user.role === "Admin") {
        // The user is in currentUsers, so they can access all message

        const res2 = await realGroupMessageModel
          .find({ message_parent_id: groupMessage._id })
          .skip((req.query.page - 1) * 50)
          .limit(50)
          .sort({
            timestamp: -1,
          });
        const total = await realGroupMessageModel.countDocuments({
          message_parent_id: groupMessage._id,
        });
        groupMessage.messages = res2.reverse();
        res.status(200).send({
          data: groupMessage,
          message: "Contacts received successfully",
          success: true,
          total,
          totalPages: Math.ceil(total / 50),
        });
        // return res.json(messages);
      } else if (previousUser) {
        const res2 = await realGroupMessageModel
          .find({
            message_parent_id: groupMessage._id,
            timestamp: {
              $lte: previousUser.leaveTime,
            },
          })
          .skip((req.body.page - 1) * 50)
          .limit(50)
          .sort({
            timestamp: -1,
          });
        const total = await realGroupMessageModel.countDocuments({
          message_parent_id: groupMessage._id,
          timestamp: {
            $lte: previousUser.leaveTime,
          },
        });
        groupMessage.messages = res2.reverse();
        res.status(200).send({
          data: groupMessage,
          message: "Contacts received successfully",
          success: true,
          total,
          totalPages: Math.ceil(total / 50),
        });
        const messagesBeforeLeaveTime = groupMessage.messages.filter(
          (message) => message.timestamp <= previousUser.leaveTime
        );

        // Combine groupMessage fields and filtered messages
        const result = {
          ...groupMessage.toObject(),
          messages: messagesBeforeLeaveTime,
        };

        return res.json(result);
      } else {
        // The user is not in currentUsers or previousUsers, so they don't have access
        return res.status(403).json({ error: "Access denied" });
      }
    });
  },

  DeleteContact: function (req, res) {
    const id = req.body._id;
    ContactServices.DeleteContact(id)
      .then(function (result) {
        return res.json(result);
      })
      .catch(function (error) {
        return res.json(error);
      });
  },

  AddNewMessage: async (req, res) => {
    try {
      const { contactId } = req.body;

      const message = req.body;
      delete message.contactId;
      // Find the contact by its ID
      const msg = await messageModel.findById(contactId);

      if (!msg) {
        return res.status(404).json({ error: "Contact not found" });
      }
      let readBy = [message?.senderId];
      // Create a new message
      const m = {
        ...message,
        message_parent_id: msg["_id"],
        readBy,
      };
      const ress = await realMessageModel.create(m);
      msg.updatedAt = new Date();

      await msg.save();
      res.status(201).json({
        message: "Message inserted successfully",
        data: ress,
        msgId: msg._id,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  ForwardMsg: async (req, res) => {
    req.body.people.forEach(async (e) => {
      if (e.currentUsers) {
        const msg = await groupMessageModel.findById(e._id);
        if (msg) {
          // Create a new message
          const newMessage = {
            senderId: req.body.prospectId,
            receiverId: e.currentUsers,
            senderName: req.body.senderName,
            message: req.body.message.message,
            messageType: req.body.message.textFileType,
            readBy: [req.body.prospectId],
            forwarded: true,
          };

          msg.messages.push(newMessage);
          msg.updatedAt = new Date();

          await msg.save();
        }
      } else {
        const msg = await messageModel.findById(e._id);
        if (msg) {
          // Create a new message
          const newMessage = {
            senderId: req.body.prospectId,
            receiverId: e.vendorId,
            message: req.body.message.message,
            messageType: req.body.message.textFileType,
            readBy: [req.body.prospectId],
            forwarded: true,
          };

          msg.messages.push(newMessage);
          msg.updatedAt = new Date();

          await msg.save();
        }
      }
    });
    res.send({ success: true });
  },

  UploadFile: async (req, res) => {
    // Check if a file was uploaded
    if (!req.files || !req.files.file) {
      return res.status(400).json({ error: "No file was uploaded." });
    }

    try {
      const s3 = new aws.S3({
        region: "ap-south-1",
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_KEY,
      });
      const timestamp = moment().format("YYYYMMDD_HHmmss");
      const modifiedFileName = `${timestamp}_${req.files.file.name}`;
      // Define the parameters for uploading the file to S3
      const fileParams = {
        Bucket: "wedfield",
        Key: modifiedFileName,
        Body: req.files.file.data, // Use req.files.file.data as the file data
        ContentType: req.files.file.mimetype, // Use req.files.file.mimetype as the content type
      };

      // Upload the file to S3
      await s3.putObject(fileParams).promise();

      // Generate a URL for the uploaded file
      const imageUrl = s3.getSignedUrl("getObject", {
        Bucket: "wedfield",
        Key: modifiedFileName,
        Expires: 3600, // URL expiration time in seconds (adjust as needed)
      });

      // Respond with the uploaded image URL
      console.log(
        "🚀 ~ file: contactController.js:987 ~ UploadFile: ~ imageUrl.split()[0]:",
        imageUrl.split("?")[0]
      );
      res
        .status(200)
        // .send(
        //   `https://wedcell.s3.ap-south-1.amazonaws.com/${modifiedFileName}`
        // );
        .send(replaceS3BaseUrl(imageUrl.split("?")[0]));
    } catch (err) {
      console.error("Error uploading file:", err);
      res.status(500).json({ error: "Error uploading the file." });
    }
  },

  AddNewGroupMessage: async (req, res) => {
    try {
      const { contactId } = req.body;
      const msg = await groupMessageModel.findById(contactId);
      const message = req.body;
      delete message.contactId;
      if (!msg) {
        return res.status(404).json({ error: "Contact not found" });
      }
      msg.updatedAt = new Date();
      await msg.save();

      const m = {
        ...message,
        message_parent_id: msg["_id"],
        readBy: [message.senderId],
      };
      const ress = await realGroupMessageModel.create(m);
      res.status(201).json({
        message: "Message inserted successfully",
        data: ress,
        msgId: msg._id,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  DeleteMsg: async function (req, res) {
    try {
      const ress = await realMessageModel.findByIdAndDelete(req.body.messageId);
      if (ress) res.send(true);
    } catch (error) {
      return res.status(200).json(error);
    }
  },
  DeleteGroupMsg: async function (req, res) {
    var data = req.body;

    try {
      const ress = await realGroupMessageModel.findByIdAndDelete(
        req.body.messageId
      );
      if (ress) res.send(true);
    } catch (error) {
      return res.json(error);
    }
  },
};
