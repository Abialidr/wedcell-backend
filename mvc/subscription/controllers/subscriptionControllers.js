// var SubscriptionServices = require("../services/SubscriptionServices");
const Subscription = require("../models/subscriptionModel");
// const { async } = require("q");
module.exports = {

  CreateSubscription: async function (req, res) {
    var data = req.body;
    try {
      let condition = { is_delete: false };
      await Subscription.create(data);
      const result = await Subscription.find(condition);
      return res.json(result);
    } catch (error) {
      return res.status(500).json(error.message);
    }
    // SubscriptionServices.CreateSubscription(data)
    //   .then(function (result) {
    //     return res.json(result);
    //   })
    //   .catch(function (error) {
    //     return res.json(error);
    //   });
  },

  GetSubscription: async function (req, res) {
    let condition = { is_delete: false, _id: res.params.id };
    try {
      const result = await Subscription.find(condition);
      return res.json(result);
    } catch (error) {
      return res.status(500).json(error.message);
    }
    // SubscriptionServices.GetSubscription(condition)
    //   .then(function (result) {
    //     return res.json(result);
    //   })
    //   .catch(function (error) {
    //     return res.json(error);
    //   });
  },

  GetSubscriptionAll: async (req, res) => {
    const condition = { is_delete: false };

    try {
      const result = await Subscription.find(condition);
      return res.json(result);
    } catch (error) {
      return res.status(500).json(error.message);
    }
    // SubscriptionServices.GetSubscription(condition)
    //   .then(function (result) {
    //     return res.json(result);
    //   })
    //   .catch(function (error) {
    //     return res.json(error);
    //   });
  },

  UpdateSubscription: async (req, res) => {
    let data = req.body;
    let condition = {
      _id: req.params.id,
    };
    try {
      const result = await Subscription.updateOne(condition, data);
      return res.json(result);
    } catch (error) {
      return res.status(500).json(error.message);
    }
    // SubscriptionServices.UpdateSubscription(condition, data)
    //   .then(function (result) {
    //     return res.json(result);
    //   })
    //   .catch(function (error) {
    //     return res.json(error);
    //   });
  },

  DeleteSubscription: async function (req, res) {
    let data = {
      is_delete: true,
    };
    let condition = {
      _id: req.params.id,
    };
    try {
      const result = await Subscription.deleteOne(condition, data);
      return res.json(result);
    } catch (error) {
      return res.status(500).json(error.message);
    }
    // SubscriptionServices.DeleteSubscription(condition, data)
    //   .then(function (result) {
    //     return res.json(result);
    //   })
    //   .catch(function (error) {
    //     return res.json(error);
    //   });
  },

};
