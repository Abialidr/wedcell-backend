const express = require("express");
const EventRouter = express.Router();
const {
  isWorking,
  getById,
  getByVendorId,
  getAllEvents,
  insertEvents,
  updateEvents,
  deleteEvents,
  getAllEventsWithVendors,
  getOneEventsWithVendors
} = require("../controllers/EventController");
const auth = require("../../../middleware/auth");

EventRouter.get("/",auth, isWorking);
EventRouter.get("/getone/:id",auth, getById);
EventRouter.get("/getall", getAllEvents);
EventRouter.get("/getallwithvendors/:id", getAllEventsWithVendors);
EventRouter.get("/getonewithvendors/:id", getOneEventsWithVendors);
EventRouter.get("/getbyvendorid",auth, getByVendorId);
EventRouter.post("/insert",auth, insertEvents);
EventRouter.post("/update",auth, updateEvents);
EventRouter.delete("/:id",auth, deleteEvents);


module.exports = EventRouter;
