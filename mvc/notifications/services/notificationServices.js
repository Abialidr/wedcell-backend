var q = require("q");
var NotificationModels = require("../models/notificationModels");
var UsersService = require("../../users/services/UserServices");
var ItemService = require("../../items/services/ItemServices");
var nodemailer = require("nodemailer");
var fs = require("fs");
var path = require("path");

const admin = require("firebase-admin");
let FirebaseAdmin;
try {
  const config = require("../../../servicekey.json");
  FirebaseAdmin = admin.initializeApp({
    credential: admin.credential.cert(config),
  });
} catch (error) {
  console.warn("Firebase servicekey.json not found, notifications will not work.");
}

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

function NotificationServices() {
  function CreateNotification(data) {
    var deferred = q.defer();
    NotificationModels.create(data)
      .then(function (result) {
        var resp = {
          success: true,
          message: "Notification created Successfully",
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
    return deferred.promise;
  }

  function GetNotification(condition, pagination) {
    var deferred = q.defer();
    NotificationModels.find(condition)
      .populate({ path: "orderId", populate: { path: "userId" } })
      .populate({ path: "orderId", populate: { path: "itemId" } })
      .populate({ path: "orderId", populate: { path: "shopkeeperId" } })
      .sort({ createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit)
      .then(async (result) => {
        let pageCount = await NotificationModels.find(condition);
        var resp = {
          success: true,
          message: "Notifications Gets Successfully",
          data: result,
          pageCount: Math.ceil(pageCount.length / pagination.limit),
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
    return deferred.promise;
  }

  function SendNotification(id, smessege) {
    var deferred = q.defer();
    const condition = { _id: id };
    var registrationToken = "";
    UsersService.GetUser(condition).then((res) => {
      if (res.data.length) {
        registrationToken = res.data[0].device_token;
        var message = {
          notification: { title: "Send Me Box", body: smessege },
          token: registrationToken,
        };

        // Send a message to the device corresponding to the provided
        // registration token.
        FirebaseAdmin.messaging()
          .send(message)
          .then((response) => {
            // Response is a message ID string.
            deferred.resolve(response);
          })
          .catch((error) => {
            console.error("Error sending message:", error);
            deferred.reject(error);
          });
      }
    });

    return deferred.promise;
  }
  function ItemNotification(id, name) {
    var deferred = q.defer();
    const condition = { notificationList: id };
    var registrationTokens = [];
    const smessege = "Hey " + name + "is just updated have a look";
    UsersService.GetUser(condition).then((res) => {
      if (res.data.length) {
        res.data.map((item) => {
          item.device_token && item.device_token.length
            ? registrationTokens.push(item.device_token)
            : null;
        });
        var message = {
          notification: { title: "Send Me Box", body: smessege },
          tokens: registrationTokens,
        };
        // Send a message to the device corresponding to the provided
        // registration token.
        FirebaseAdmin.messaging()
          .sendMulticast(message)
          .then((response) => {
            // Response is a message ID string.
            deferred.resolve(response);
          })
          .catch((error) => {
            deferred.reject(error);
          });
      }
    });

    return deferred.promise;
  }

  function SendBidEmail(userId, ItemID) {
    const condition = { _id: userId };
    UsersService.GetUser(condition).then((res) => {
      if (res.data.length) {
        const User = res.data[0];
        ItemService.GetItems({ _id: ItemID }).then((items) => {
          const CurrentItem = items.data[0];
          var htmldata = `Hi ${User.name}  , 
Your bid on ${CurrentItem.itemName} has been placed. The order will be processed
after the required limit for bids is filled. The payment will be automatically 
deducted from your Credit card once the item is out for delivery. 

Thanks for shopping on SendMeBox! You didn't just got a great deal in you bag but
also you supported the growth of the SendMeBox Community. Have questions or 
feedback? You can contact us anytime at sendmebox.com@gmail.com

Team SENDMEBOX

THIS ONE IS FOR EMAIL THAT IS PLACED AFTER BID.`;
          var mailOptions = {
            from: "sendmeboxcomllc@gmail.com",
            to: User.email,
            subject: "Notification for send me box app Bid Placement",
            text: htmldata,
          };
          transporter.sendMail(mailOptions, function (error, response) {
            if (error) {
              var resp = {
                success: false,
                message: "Error in procesing",
                data: error,
              };
              console.error(error);
            } else {
              var resp = {
                success: true,
                message: "Mail Sent Successfully",
                data: response.data,
                token: token,
              };
              //deferred.resolve(resp);
            }
          });
        });
        // Send a message to the device corresponding to the provided
        // registration token.
      }
    });
  }

  function SendSlipEmail(userId, ItemID, order) {
    const condition = { _id: userId };
    UsersService.GetUser(condition).then((res) => {
      if (res.data.length) {
        const User = res.data[0];
        ItemService.GetItems({ _id: ItemID }).then((items) => {
          const CurrentItem = items.data[0];
          var templateFile = path.join("./index.html");
          fs.readFile(__dirname + "/index.html", function (err, html) {
            if (err) {
              var resp = {
                success: false,
                message: "Error in processing",
                data: err,
              };
              console.error(err);
            } else {
              var htmldata = html.toString();
              htmldata = htmldata.replace("ITEMNAME", CurrentItem.itemName);
              if (CurrentItem.images.length)
                htmldata = htmldata.replace(
                  "IMAGELINK",
                  "https://sendmebox.com" + CurrentItem.images[0]
                );
              htmldata = htmldata.replace("TOTAL", order.amount);
              htmldata = htmldata.replace("TOTAL", order.amount);
              htmldata = htmldata.replace("QUANTITY", order.quantity);
              htmldata = htmldata.replace("USERNAME", User.name);
              htmldata = htmldata.replace("USEREMAIL", User.email);
              htmldata = htmldata.replace("USERPHONE", User.mobile);
              htmldata = htmldata.replace("SHPPINGADD", User.shipping_address);
              htmldata = htmldata.replace("DATE", "");

              var mailOptions = {
                from: "sendmeboxcomllc@gmail.com", // original Email
                to: User.email, //using Static for testing
                subject: "Order Receipt From Send Me Box",
                html: htmldata,
              };
              transporter.sendMail(mailOptions, function (error, response) {
                if (error) {
                  var resp = {
                    success: false,
                    message: "Error in procesing",
                    data: error,
                  };
                  console.error(error);
                } else {
                  var resp = {
                    success: true,
                    message: "Mail Sent Successfully",
                    data: response.data,
                    token: token,
                  };
                  //deferred.resolve(resp);
                }
              });
            }
          });
        });
        // Send a message to the device corresponding to the provided
        // registration token.
      }
    });
  }

  return {
    CreateNotification: CreateNotification,
    GetNotification: GetNotification,
    SendNotification: SendNotification,
    ItemNotification: ItemNotification,
    SendBidEmail: SendBidEmail,
    SendSlipEmail: SendSlipEmail,
  };
}

module.exports = NotificationServices();
