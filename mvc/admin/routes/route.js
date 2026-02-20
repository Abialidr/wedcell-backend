const express = require('express');
const adminRouter = express.Router();
const adminController = require('../controller/adminController');

//admin api
/**
 * @swagger
 * /admin/adminUpload:
 *  post:
 *    summary: adminUpload.
 *    description: create the adminUpload
 *    consumes:
 *      - application/json
 *    parameters:
 *      - in: body
 *        name: body
 *        schema:
 *           type: object
 *           required:
 *             - uplodBanner
 *             - brideName
 *             - groomName
 *             - cityName
 *             - eventDate
 *             - galaryImage
 *             - uploadAlbum
 *             - youtubeVideos
 *             - vender
 *             - deletedAt
 *             - isDeleted
 *           properties:
 *             uplodBanner:
 *               type: string
 *             brideName:
 *               type: string
 *             groomName:
 *               type: string
 *             cityName:
 *               type: string
 *             eventDate:
 *               type: string
 *               format: date-time
 *               description: Creation date and time
 *               example: "2021-01-30T08:30:00Z"
 *             galaryImage:
 *               type: string
 *             uploadAlbum:
 *               type: array
 *               items:
 *                 type: string
 *                 default: "www.google.com"
 *             youtubeVideos:
 *               type: array
 *               items:
 *                 type: string
 *                 default: "www.google.com"
 *             vender:
 *               type: array
 *               items:
 *                 type: string
 *                 default: "www.google.com"
 *             deletedAt:
 *               type: string
 *               format: date-time
 *               description: Creation date and time
 *               example: "2021-01-30T08:30:00Z"
 *             isDeleted:
 *               type: boolean
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          schema:
 *            type: object
 */
adminRouter.post('/adminUpload', adminController.adminDocuments);

/**
 * @swagger
 * /admin/alladminUpload:
 *  get:
 *    summary: Returns all adminUplod.
 *    description: Returns the all adminUplod
 *    responses:
 *      '200':
 *        description: A successful response
 *        schema:
 *          type: object
 *
 */
adminRouter.get('/alladminUpload/:id', adminController.getalladminDocuments);
adminRouter.get('/adminreports', adminController.getalladminReports);


module.exports = adminRouter;
