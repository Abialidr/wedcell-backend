var DashboardServices = require("../services/dashboardServices");
var NotificationServices = require("../../notifications/services/notificationServices");
var ObjectId = require("mongodb").ObjectId;

module.exports = {
  GetAnalytics: function (req, res) {
    let condition = {};
    if (req.user.role !== "admin") condition._id = req.user._id;
    DashboardServices.GetAnalytics(condition)
      .then(function (result) {
        return res.json(result);
      })
      .catch(function (error) {
        console.error(error, "  - - - error = ");
        return res.json(error);
      });
  },

  GetAnalyticsBar: function (req, res) {
    let condition = {};
    if (req.user.role === "admin") {
    } else {
      condition.forUserId = ObjectId(req.user._id);
    }
    NotificationServices.GetNotification(condition, {})
      .then(function (result) {
        let fObj = {};
        let temp = [];
        result.data.forEach((i) => {
          let itemTemp = i?.orderId?.itemId;
          if (
            itemTemp &&
            (temp.indexOf(i.orderId._id.toString()) === -1 ? true : false)
          ) {
            if (fObj[itemTemp._id]) {
              fObj[itemTemp._id]["bid"] =
                fObj[itemTemp._id]["bid"] + i.orderId.quantity;
            } else {
              fObj[itemTemp._id] = {};
              fObj[itemTemp._id]["name"] = itemTemp.itemName;
              fObj[itemTemp._id]["maxQuantity"] = JSON.parse(itemTemp.maxbid);
              fObj[itemTemp._id]["bid"] = i.orderId.quantity;
              fObj[itemTemp._id]["zipcode"] = itemTemp.zipcode.split(",");
            }
            temp.push(i.orderId._id.toString());
          }
        });
        var resp = {
          success: true,
          message: "Bar Graph Data",
          data: fObj,
        };
        return res.json(resp);
      })
      .catch(function (error) {
        console.error(error, "  - - - error = ");
        return res.json(error);
      });
  },

  GetNotification: function (req, res) {
    let condition = {};
    let pagination = {
      skip: 10 * (req.body.page - 1),
      limit: 10,
    };
    if (req.user.role === "admin") {
    } else {
      condition.forUserId = ObjectId(req.user._id);
    }
    NotificationServices.GetNotification(condition, pagination)
      .then(function (result) {
        return res.json(result);
      })
      .catch(function (error) {
        console.error(error, "  - - - error = ");
        return res.json(error);
      });
  },
};
