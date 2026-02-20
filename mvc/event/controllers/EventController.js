const Events = require('../models/EventModal');
var UserModels = require('../../users/models/UserModels');
var VendorUserModels = require('../../vendor user/models/VendorUserModels');
module.exports = {
  isWorking: (req, res) => {
    res.status(200).send({
      success: true,
    });
  },
  getAllEvents: async (req, res) => {
    try {
      const events = await Events.find();
      res.status(200).send(events);
    } catch (error) {
      res.status(400).send(error);
    }
  },
  getAllEventsWithVendors: async (req, res) => {
    console.log(req.params);
    if (req.params.id !== 'null') {
      try {
        let events2;
        const events = await Events.find();
        // console.log(events)
        events2 = await events.map(async (data) => {
          const user = await VendorUserModels.findById(data.vendor_id);
          if (!user) console.log(data.vendor_id);
          return {
            events: data,
            user,
          };
        });

        events2 = await Promise.all(events2);

        console.log(events2);

        if (req.params.id !== 'all') {
          events2 = events2.filter((data) => {
            return data.user.city.toLowerCase() === req.params.id.toLowerCase();
          });
        }

        console.log(events2);
        res.status(200).send(events2);
      } catch (error) {
        res.status(400).send(error);
      }
    }
  },
  getOneEventsWithVendors: async (req, res) => {
    try {
      const events = await Events.findById(req.params.id);
      const user = await UserModels.findById(events.vendor_id);
      res.status(200).send({
        events: events,
        user,
      });
    } catch (error) {
      res.status(400).send(error);
    }
  },
  getById: async (req, res) => {
    try {
      const events = await Events.findById(req.params.id);
      if (!events) {
        res.status(400).send('event not found');
      }
      res.status(200).send({
        success: true,
        events,
      });
    } catch (error) {
      res.status(400).send({
        success: false,
        error,
      });
    }
  },
  getByVendorId: async (req, res) => {
    try {
      const events = await Events.find({ vendor_id: req.user._id });
      if (!events) {
        res.status(400).send('event not found');
      }
      res.status(200).send({
        success: true,
        data: events,
      });
    } catch (error) {
      res.status(400).send({
        success: false,
        error,
      });
    }
  },
  insertEvents: async (req, res) => {
    try {
      const data = req.body;
      req.body.vendor_id = req.user._id;
      let event = new Events(req.body);
      event = await event.save();

      res.status(200).send({
        event,
        success: true,
      });
    } catch (error) {
      res.status(400).send({
        success: false,
        error,
      });
    }
  },
  updateEvents: async (req, res) => {
    try {
      req.body.vendor_id = req.user._id;
      const events = await Events.findByIdAndUpdate(
        { _id: req.body._id },
        req.body
      );
      events
        ? res.status(200).send({
            success: true,
          })
        : res.status(400).send({
            success: false,
            error: {
              message: 'event with id not found',
            },
          });
    } catch (error) {
      res.status(400).send({
        success: false,
        error,
      });
    }
  },
  deleteEvents: async (req, res) => {
    try {
      const events = await Events.findOneAndDelete({ _id: req.params.id });
      events
        ? res.status(200).send({
            success: true,
          })
        : res.status(400).send({
            success: false,
          });
    } catch (error) {
      res.status(400).send({
        success: false,
        error,
      });
    }
  },
};
