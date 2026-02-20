var q = require("q");
var ContactModels = require("../models/contactModel");
const mongoose = require("mongoose");
const messageModel = require("../models/messageModel");
const groupMessageModel = require("../models/groupMessageModel");

function ContactServices() {
  function AddContact(data) {
    var deferred = q.defer();
    ContactModels.create(data)
      .then(async function (result) {
        var resp = {
          success: true,
          message: "Contact Added",
          data: result,
        };
        deferred.resolve(resp);
      })
      .catch(function (error) {
        var resp = {
          success: false,
          message: "Error in processing",
          data: error,
        };
        deferred.reject(resp);
        console.error("err", resp);
      });

    return deferred.promise;
  }
  function AddMessage(data) {
    var deferred = q.defer();

    messageModel
      .create(data)
      .then(async function (result) {
        var resp = {
          success: true,
          message: "Message Added",
          data: result,
        };
        deferred.resolve(resp);
      })
      .catch(function (error) {
        var resp = {
          success: false,
          message: "Error in processing",
          data: error,
        };
        deferred.reject(resp);
        console.error("err", resp);
      });

    return deferred.promise;
  }
  function AddGroupMessage(data) {
    var deferred = q.defer();

    groupMessageModel
      .create(data)
      .then(async function (result) {
        var resp = {
          success: true,
          message: "Group Added",
          data: result,
        };
        deferred.resolve(resp);
      })
      .catch(function (error) {
        var resp = {
          success: false,
          message: "Error in processing",
          data: error,
        };
        deferred.reject(resp);
        console.error("err", resp);
      });

    return deferred.promise;
  }

  function GetContacts(condition) {
    var deferred = q.defer();
    console.log("inside getcontacts", condition);
    ContactModels.find(condition)
      .then(function (result) {
        // console.log(result)
        var resp = {
          success: true,
          message: "Contacts received successfully",
          data: result,
        };
        deferred.resolve(resp);
      })
      .catch(function (error) {
        var resp = {
          success: false,
          message: "Error in processing",
          data: error,
        };
        deferred.reject(resp);
      });
  }
  function GetMessages(condition, userId) {
    var deferred = q.defer();

    // console.log(condition)
    
    condition.prospectId
      ? (condition.prospectId = mongoose.Types.ObjectId(condition.prospectId))
      : (condition.vendorId = mongoose.Types.ObjectId(condition.vendorId));
      console.log("🚀 ~ GetMessages ~ condition:", condition)

    var deferred = q.defer();
    messageModel
      .aggregate([
        {
          $match: condition,
        },
        {
          $addFields: {
            messages: {
              $filter: {
                input: "$messages",
                as: "message",
                cond: {
                  $not: {
                    $in: [
                      mongoose.Types.ObjectId(userId),
                      "$$message.deletedBy",
                    ],
                  },
                },
              }
            },
          },
        },
        {
          $addFields: {
            lastMessage: {
              $arrayElemAt: ["$messages", -1],
            },
          },
        },
        {
          $project: {
            messages: 0,
          },
        },
      ])
      .exec((err, result) => {
        if (err) {
          var resp = {
            success: false,
            message: "Error in processing",
            data: err,
          };
          deferred.reject(resp);
        }
        // console.log('RESULT', result);
        var resp = {
          success: true,
          message: "Contacts received successfully",
          data: result,
        };
        deferred.resolve(resp);
        // console.log('Contacts with Last Messages:', result);
      });

    return deferred.promise;
  }
  function GetSingleMessage(id, userId) {
    var deferred = q.defer();

    console.log(id);
    messageModel.updateMany(
      { "messages.timestamp": { $lt: new Date() } },
      { $addToSet: { "messages.$.readBy": userId } },
      (err, doc) => {
        if (err) {
          console.error(err);
          deferred.reject({
            success: false,
            message: "Error updating readBy array",
            data: err,
          });
          return;
        }

        messageModel
          .aggregate([
            { $match: { _id: mongoose.Types.ObjectId(id) } },
            {
              $project: {
                _id: 1,
                prospectName: 1,
                prospectContact: 1,
                prospectImage: 1,
                vendorName: 1,
                vendorContact: 1,
                vendorImage: 1,
                allowAccess: 1,
                initiatorId: 1,
                prospectId: 1,
                vendorId: 1,
                vendorType: 1,
                messages: {
                  $filter: {
                    input: "$messages",
                    as: "message",
                    cond: {
                      // $ne: ['$$message.receiverId', mongoose.Types.ObjectId(userId)],
                      $not: {
                        $in: [
                          mongoose.Types.ObjectId(userId),
                          "$$message.deletedBy",
                        ],
                      },
                    },
                  },
                },
                createdAt: 1,
                updatedAt: 1,
                __v: 1,
                id: "$_id",
              },
            },
          ])
          .exec()
          .then(function (result) {
            console.log("RESULT", result);
            var resp = {
              success: true,
              message: "Contacts received successfully",
              data: result[0],
            };
            deferred.resolve(resp);
          })
          .catch(function (error) {
            var resp = {
              success: false,
              message: "Error in processing",
              data: error,
            };
            deferred.reject(resp);
          });
      }
    );
    return deferred.promise;
  }
  function GetGroupMessages(condition, userId) {
    var deferred = q.defer();
  
    if (condition.prospectId) {
      condition.prospectId = mongoose.Types.ObjectId(condition.prospectId);
    } else if (condition.vendorId) {
      condition["vendorInfo.vendorId"] = mongoose.Types.ObjectId(
        condition.vendorId
      );
      condition.vendorId = undefined
    }
  
    var pipeline = [
      {
        $match: condition,
      },
      {
        $addFields: {
          messages: {
            $filter: {
              input: "$messages",
              as: "message",
              cond: {
                $not: {
                  $in: [
                    mongoose.Types.ObjectId(userId),
                    "$$message.deletedBy",
                  ],
                },
              },
            }
          },
        },
      },
      {
        $addFields: {
          lastMessage: {
            $arrayElemAt: ["$messages", -1],
          },
        },
      },
      {
        $project: {
          messages: 0,
        },
      },
    ];
  
    // Add additional conditions based on prospectId and vendorId
    // if (condition.prospectId) {
    //   pipeline.unshift({
    //     $match: {
    //       isActive: true,
    //     },
    //   });
    // } 
  
    groupMessageModel.aggregate(pipeline).exec((err, result) => {
      if (err) {
        var resp = {
          success: false,
          message: "Error in processing",
          data: err,
        };
        deferred.reject(resp);
      }
      console.log(result);
      var resp = {
        success: true,
        message: "Contacts received successfully",
        data: result,
      };
      deferred.resolve(resp);
    });
  
    return deferred.promise;
  }
  
  async function GetSingleGroupMessage(id, userId) {
    return groupMessageModel.aggregate([
      {
        $match: {
          $or: [
            { currentUsers: mongoose.Types.ObjectId(userId) },
            {
              previousUsers: {
                $elemMatch: {
                  id: mongoose.Types.ObjectId(userId),
                  leaveTime: { $exists: false },
                },
              },
            },
          ],
        },
      },
    ])
      .exec((err, groupMessage) => {
        if (err) {
          // Handle the error
          return({ error: "An error occurred" });
        }
        console.log(groupMessage)
        // messages will contain the filtered messages
        return(groupMessage[0]);
      });
   }
  function DeleteContact(id) {
    var deferred = q.defer();
    ContactModels.findByIdAndDelete(id)
      .then(function (result) {
        var resp = {
          success: true,
          message: "Contact Deleted",
          data: result,
        };
        deferred.resolve(resp);
      })
      .catch(function (error) {
        var resp = {
          success: false,
          message: "Error in processing",
          data: error,
        };
        deferred.reject(resp);
        console.error("err", resp);
      });

    return deferred.promise;
  }
  function ReadMsg(type, userId) {
    var data = req.body;

    console.log(data);
    try {
      if (type == "personal") {
        messageModel.updateMany(
          { "messages.timestamp": { $lt: new Date() } },
          { $addToSet: { "messages.$.readBy": userId } },
          (err, doc) => {
            if (err) {
              console.error(err);
              return;
            }
            if (!doc) {
              console.error("Group message not found");
              return;
            }
            console.log(
              "User added to the readBy array for the specific message."
            );
          }
        );
      } else if (type == "group") {
        groupMessageModel.updateMany(
          { "messages.timestamp": { $lt: new Date() } },
          { $addToSet: { "messages.$.readBy": userId } },
          (err, doc) => {
            if (err) {
              console.error(err);
              return;
            }
            if (!doc) {
              console.error("Group message not found");
              return;
            }
            console.log(
              "User added to the readBy array for the specific message."
            );
          }
        );
      }
    } catch (error) {
      return res.json(error);
    }
  }

  return {
    AddContact: AddContact,
    GetContacts: GetContacts,
    AddGroupMessage: AddGroupMessage,
    DeleteContact: DeleteContact,
    GetSingleMessage: GetSingleMessage,
    GetMessages: GetMessages,
    AddMessage: AddMessage,
    GetGroupMessages: GetGroupMessages,
    GetSingleGroupMessage: GetSingleGroupMessage,
    ReadMsg: ReadMsg,
  };
}

module.exports = ContactServices();
