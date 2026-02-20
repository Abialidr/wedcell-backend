var express = require('express');
var BlogsRouter = express.Router();
var BlogControllers = require('../controllers/BlogControllers');
var UtilsServices = require('../../utils/services/UtilsServices');
var auth = require('../../../middleware/auth');

/**
 * @swagger
 * /blog/create:
 *  post:
 *    summary: Create  Blog
 *    description: Create the Blog
 *    parameters:
 *      - name: authorization
 *        in: header
 *        description: an authorization header
 *        required: true
 *        type: string
 *      - in: body
 *        name: body
 *        schema:
 *          type: object
 *          properties:
 *            token:
 *              type: string
 *            title:
 *              type: string
 *            mainImage:
 *              type: string
 *            type:
 *              type: string
 *            category:
 *              type: string
 *            description:
 *              type: string
 *            status:
 *              type: string
 *            rank:
 *              type: string
 *            url:
 *              type: string
 *            keywords:
 *              type: array
 *              items:
 *                type: string
 *            vendorId:
 *              type: string
 *            is_delete:
 *              type: boolean
 *    responses:
 *      '200':
 *        description: A successful response
 *        schema:
 *          type: object
 *
 */
BlogsRouter.post('/create', auth, BlogControllers.CreateBlogs);

/**
 * @swagger
 * /blog/get:
 *  post:
 *    summary: Returns  Blog
 *    description: Returns the Blog
 *    parameters:
 *      - name: authorization
 *        in: header
 *        description: an authorization header
 *        required: true
 *        type: string
 *      - in: body
 *        name: body
 *        schema:
 *          type: object
 *          properties:
 *            _id:
 *              type: string
 *            token:
 *              type: string
 *    responses:
 *      '200':
 *        description: A successful response
 *        schema:
 *          type: object
 *
 */
BlogsRouter.post('/get', auth, BlogControllers.GetBlogs);

/**
 * @swagger
 * /blog/getBlog:
 *  post:
 *    summary: Returns  Blog
 *    description: Returns the Blog
 *    parameters:
 *      - name: authorization
 *        in: header
 *        description: an authorization header
 *        required: true
 *        type: string
 *      - in: body
 *        name: body
 *        schema:
 *          type: object
 *          properties:
 *            _id:
 *              type: string
 *            token:
 *              type: string
 *    responses:
 *      '200':
 *        description: A successful response
 *        schema:
 *          type: object
 *
 */
BlogsRouter.get('/getBlog/:id', BlogControllers.Get_Blogs);

BlogsRouter.get('/getall', BlogControllers.GetBlogsAll);
BlogsRouter.post('/update', BlogControllers.UpdateBlogs);
BlogsRouter.post('/delete', auth, BlogControllers.DeleteBlogs);
BlogsRouter.post(
  '/mainimage',
  auth,
  UtilsServices.Upload.array('image'),
  BlogControllers.BlogMainImage
);

module.exports = BlogsRouter;
