var q = require('q');
var UserModels = require('../../users/models/UserModels');
var ItemModels = require('../../items/models/ItemModels');
var OrdersModels = require('../../orders/models/orderModels');

function OrdersServices() {

  GetAnalytics = async (condition) => {
    condition.role = "shopkeeper";
    var deferred = q.defer();
    let shopkeeperCount = await UserModels.find(condition);

    let c1 = {};
    if (condition._id) c1.shopkeeperId = condition._id;
    let itemCount = await ItemModels.find(c1);
    itemCount = itemCount?.length;

    let Orders = await OrdersModels.find(c1);
    let sum = 0;
    Orders?.map(j => { sum += j.amount; });
    Orders = sum;

    let ItemAddedLineGraph = await ItemModels.aggregate(
      [
        {
          $group: {
            _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" }, day: { $dayOfMonth: "$createdAt" } },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]
    );
    let ItemSoldLineGraph = await OrdersModels.aggregate(
      [
        {
          $group: {
            _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" }, day: { $dayOfMonth: "$createdAt" } },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]
    );
    var resp = {
      success: true,
      message: 'Orders Gets Successfully',
      data: { shopkeeperCount: shopkeeperCount.length, itemCount, Orders, ItemAddedLineGraph, ItemSoldLineGraph }
    };
    deferred.resolve(resp);
    return deferred.promise;
  };

  GetAnalyticsBar = async () => {
    var deferred = q.defer();
    let shopkeeperCount = await UserModels.find({ role: "shopkeeper" });
    let itemCount = await ItemModels.estimatedDocumentCount();
    let Orders = await OrdersModels.aggregate([{ $match: {} }, {
      $group:
      {
        "_id": null,
        "sum": { $sum: "$amount" },
        "TotalCount": { $sum: 1 }
      }
    }]);
    let ItemAddedLineGraph = await ItemModels.aggregate(
      [
        {
          $group: {
            _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" }, day: { $dayOfMonth: "$createdAt" } },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]
    );
    let ItemSoldLineGraph = await OrdersModels.aggregate(
      [
        {
          $group: {
            _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" }, day: { $dayOfMonth: "$createdAt" } },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]
    );
    var resp = {
      success: true,
      message: 'Orders Gets Successfully',
      data: { shopkeeperCount: shopkeeperCount.length, itemCount, Orders, ItemAddedLineGraph, ItemSoldLineGraph }
    };
    deferred.resolve(resp);
    return deferred.promise;
  };

  return {
    GetAnalytics: GetAnalytics,
    GetAnalyticsBar: GetAnalyticsBar
  };
};

module.exports = OrdersServices();
