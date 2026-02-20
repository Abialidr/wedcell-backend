var express = require("express");
var ContactRouter = express.Router();
var ContactController = require("../controllers/contactController");
var auth = require("../../../middleware/auth");
const fileUpload = require("express-fileupload");

ContactRouter.get("/get", auth, ContactController.GetContacts1);
ContactRouter.get("/getforVendor", auth, ContactController.GetVendorsContacts1);
ContactRouter.get("/getall", auth, ContactController.GetAll1);
ContactRouter.get("/getonecontact", auth, ContactController.GetSingleContact1);
ContactRouter.get("/getmessages", auth, ContactController.GetMessages1);
ContactRouter.get("/getone", auth, ContactController.GetSingleContact1);
ContactRouter.get("/getgroups", auth, ContactController.GetGroupMessages1);
ContactRouter.post("/add", auth, ContactController.AddContact);
ContactRouter.post(
  "/addFromVendor",
  auth,
  ContactController.AddContactFromVendor
);
ContactRouter.patch("/update", auth, ContactController.UpdateContact);
ContactRouter.post("/get", auth, ContactController.GetContacts);
ContactRouter.post("/getall", auth, ContactController.GetAll);
ContactRouter.post("/getonecontact", auth, ContactController.GetSingleContact);
ContactRouter.post(
  "/getonemsgbytwoid",
  auth,
  ContactController.GetMessageByTwoId
);
ContactRouter.post("/getmessages", auth, ContactController.GetMessages);
ContactRouter.post("/admingetmsg", auth, ContactController.GetMessagesForAdmin);
ContactRouter.post("/getone", auth, ContactController.GetSingleMessage);
ContactRouter.post("/getgroups", auth, ContactController.GetGroupMessages);
ContactRouter.get(
  "/getonegroup",
  auth,
  ContactController.GetSingleGroupMessage
);
ContactRouter.post("/delete", auth, ContactController.DeleteContact);
ContactRouter.post("/addmessage", auth, ContactController.AddNewMessage);
ContactRouter.post("/forwardmsg", auth, ContactController.ForwardMsg);
ContactRouter.post(
  "/addgroupmessage",
  auth,
  ContactController.AddNewGroupMessage
);
ContactRouter.post("/creategroup", auth, ContactController.CreateGroup);
ContactRouter.post("/addtogroup", auth, ContactController.AddToGroup);
ContactRouter.post("/renamegroup", auth, ContactController.RenameGroup);
ContactRouter.post("/removefromgroup", auth, ContactController.RemoveFromGroup);
ContactRouter.post("/leavefromgroup", auth, ContactController.LeaveFromGroup);
ContactRouter.post(
  "/uploadfile",
  fileUpload(),
  auth,
  ContactController.UploadFile
);
// ContactRouter.post("/updatemsg", auth, ContactController.UpdateMsg);
ContactRouter.post("/deletemsg", auth, ContactController.DeleteMsg);
ContactRouter.post("/deletegrpmsg", auth, ContactController.DeleteGroupMsg);

module.exports = ContactRouter;
// getgroups
// getmessages
// getmessagesAdmin
