const socketIo = require("socket.io");
const groupMessageModel = require("./mvc/contact/models/groupMessageModel");
const messageModel = require("./mvc/contact/models/messageModel");

const activeChats = {};

module.exports = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on("initiateChat", (data) => {
      io.to(data.id).emit("newmsg", {
        msgId: data.id,
      });
    });
    socket.on("creategroup", (data) => {
      console.log("hkjhjk", data);
      data.currentUsers.forEach((rid) => {
        io.to(rid).emit("newgroup", {
          msgId: data._id,
        });
      });
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);

      for (const chatId in activeChats) {
        if (activeChats[chatId].user1 === socket.id) {
          delete activeChats[chatId];
          io.to(chatId).emit("userLeft", socket.id);
          break;
        }
      }
    });

    socket.on("joinSelf", (userId) => {
      console.log("🚀 ~ socket.on ~ userId:", userId)
      if (!socket.rooms.has(userId)) {
        console.log(`User ${userId} joined self`);
        userId && socket.join(userId);
      }
    });
    // socket.on('joinChat', (ID) => {
    //   // Handle the 'joinSelf' event here
    //   console.log(`${ID} joined`);
    //   socket.join(ID);
    //   // You can add more logic here as needed
    // });

    socket.on("read", (data) => {
      const { userId, type } = data;
      console.log("ssssssss", data);
    });

    socket.on("message", (data) => {
      const { contactId, senderId, receiverId, message, senderName } =
        data.messageBody;
      console.log("🚀 ~ socket.on ~ receiverId:", receiverId);
      console.log("ssssssss", data);
      if (typeof receiverId == "string") {
        io.to(receiverId).emit("message", {
          data: data.data,
          msgId: data.msgId,
          msg: {
            img: "",
            message: message,
            time: new Date(Date.now()).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            name: senderName,
            time: "04:06 PM",
            type: "sender",
          },
        });
      } else {
        receiverId.forEach((rid) => {
          console.log("🚀 ~ receiverId.forEach ~ rid:", rid)
          io.to(rid).emit("message", {
            data: data.data,
            msgId: data.msgId,
            msg: {
              img: "",
              message: message,
              time: new Date(Date.now()).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              name: senderName,
              type: "sender",
            },
          });
        });
      }
    });
    socket.on("forward", (data) => {
      console.log("asdasdasdasd", data);
      data.people.forEach(async (e) => {
        if (e.currentUsers) {
          const msg = await groupMessageModel.findById(e._id);
          // console.log(msg)
          if (msg) {
            // Create a new message
            const newMessage = {
              senderId: data.prospectId,
              receiverId: e.currentUsers,
              senderName: data.senderName,
              message: data.message.message,
              messageType: data.message.textFileType,
              readBy: [data.prospectId],
              forwarded: true,
            };

            msg.messages.push(newMessage);
            msg.updatedAt = new Date();

            await msg.save();
            io.emit("message", {
              data: {
                contactId: e._id,
                messageType: data.message.textFileType,
                forwarded: true,
                readBy: [data.prospectId],
                deletedBy: [],
                _id: e._id,
                senderId: data.prospectId,
                receiverId: e.currentUsers,
                message: data.message.message,
                timestamp: Date.now(),
                senderName: data.senderName,
              },
              msgId: e._id,
              messageBody: {
                contactId: e._id,
                senderId: data.prospectId,
                receiverId: e.currentUsers,
                senderName: data.senderName,
                time: new Date(Date.now()).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
                message: data.message.message,
                messageType: data.message.textFileType,
              },
            });
          }
        } else {
          const msg = await messageModel.findById(e._id);
          console.log(msg);
          if (msg) {
            // Create a new message
            const newMessage = {
              senderId: data.prospectId,
              message: data.message.message,
              messageType: data.message.textFileType,
              readBy: [data.prospectId],
              forwarded: true,
            };
            e.vendorId
              ? (newMessage.receiverId = e.vendorId)
              : (newMessage.receiverId = e.prospectId),
              msg.messages.push(newMessage);
            msg.updatedAt = new Date();

            await msg.save();
            io.emit("message", {
              data: {
                messageType: data.message.textFileType,
                forwarded: true,
                readBy: [data.prospectId],
                deletedBy: [],
                _id: e._id,
                senderId: data.prospectId,
                receiverId: e.currentUsers,
                message: data.message.message,
                timestamp: Date.now(),
              },
              msgId: e._id,
              messageBody: {
                contactId: e._id,
                senderId: data.prospectId,
                receiverId: e.currentUsers,
                senderName: data.senderName,
                time: new Date(Date.now()).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
                message: data.message.message,
                messageType: data.message.textFileType,
              },
            });
          }
        }
      });
    });
  });

  function generateChatId(user1, user2) {
    const sortedIds = [user1, user2].sort();
    return `chat_${sortedIds[0]}_${sortedIds[1]}`;
  }
  return io;
};
