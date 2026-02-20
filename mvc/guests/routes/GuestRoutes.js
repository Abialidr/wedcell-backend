var express = require('express');
var GuestRouter = express.Router();
var GuestControllers = require('../controllers/GuestControllers');
const auth = require('../../../middleware/auth');
// var UtilsServices = require("../../utils/services/UtilsServices");

GuestRouter.post('/', auth, GuestControllers.CreateGuests);
GuestRouter.put('/update', GuestControllers.UpdateGuests);
GuestRouter.delete('/:id', auth, GuestControllers.DeleteGuest);
GuestRouter.put('/', auth, GuestControllers.GetGuests);
GuestRouter.put('/get', auth, GuestControllers.GetGuests1);
GuestRouter.get('/get', auth, GuestControllers.GetGuests2);
// GuestRouter.get('/:id', auth, GuestControllers.GetGuest);
GuestRouter.get('/gender', auth, GuestControllers.genderGuest);
GuestRouter.get('/apd', auth, GuestControllers.apdGuest);
GuestRouter.get('/invitesent', auth, GuestControllers.invitesentGuest);
GuestRouter.get('/at', auth, GuestControllers.atGuest);
GuestRouter.put('/groups', auth, GuestControllers.groupsGuest);
GuestRouter.get('/groups', auth, GuestControllers.groupsGuest1);
GuestRouter.put('/menu', auth, GuestControllers.menuGuest);
GuestRouter.get('/menu', auth, GuestControllers.menuGuest1);
GuestRouter.get('/getAttendance', auth, GuestControllers.AttendanceGuest);
GuestRouter.post('/getInviteGuest', auth, GuestControllers.InviteGuest);
GuestRouter.get('/getInviteGuest', auth, GuestControllers.InviteGuest1);

module.exports = GuestRouter;
