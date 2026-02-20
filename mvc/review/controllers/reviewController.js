const reviewModal = require('../model/ReviewModel.js');
const replyModal = require('../model/ReplyModel.js');
const productModel = require('../../shop/model/productModel.js');
const venueModal = require('../../venue user/models/VenueUserModels.js');
const vendorModal = require('../../vendor user/models/VendorUserModels.js');
module.exports = {
  getAllReview: async (req, res) => {
    try {
      condition = {};
      req.body.userid ? (condition.userid = { $ne: req.body.userid }) : null;
      req.body.productid ? (condition.productid = req.body.productid) : null;
      const result = await reviewModal
        .find(condition)
        .skip((req.body.page - 1) * 5)
        .limit(5);
      const total = await reviewModal.countDocuments(condition);
      const currentReviewCount = await reviewModal
        .countDocuments(condition)
        .skip((req.body.page - 1) * 5)
        .limit(5);
      const total1 = await reviewModal.countDocuments({ rating: 1 });
      const total2 = await reviewModal.countDocuments({ rating: 2 });
      const total3 = await reviewModal.countDocuments({ rating: 3 });
      const total4 = await reviewModal.countDocuments({ rating: 4 });
      const total5 = await reviewModal.countDocuments({ rating: 5 });
      const remainingReviews =
        total - 5 * req.body.page < 0 ? 0 : total - 5 * req.body.page;
      if (result) {
        return res.status(200).send({
          success: true,
          data: result,
          total1,
          total2,
          total3,
          total4,
          total5,
          total,
          page: req.body.page,
          totalPage: Math.ceil(total / 5),
          remainingReviews,
          currentReviewCount,
        });
      }
    } catch (error) {
      console.error(
        '🚀 ~ file: reviewController.js:102 ~ createReview: ~ error:',
        error
      );
      return res.status(400).send({
        success: false,
        message: 'something went wrong',
        error,
      });
    }
  },
  getAllReview1: async (req, res) => {
    try {
      condition = {};
      req.query.userid ? (condition.userid = { $ne: req.query.userid }) : null;
      req.query.productid ? (condition.productid = req.query.productid) : null;
      const result = await reviewModal
        .find(condition)
        .skip((req.query.page - 1) * 5)
        .limit(5);
      const total = await reviewModal.countDocuments(condition);
      const currentReviewCount = await reviewModal
        .countDocuments(condition)
        .skip((req.query.page - 1) * 5)
        .limit(5);
      const total1 = await reviewModal.countDocuments({ rating: 1 });
      const total2 = await reviewModal.countDocuments({ rating: 2 });
      const total3 = await reviewModal.countDocuments({ rating: 3 });
      const total4 = await reviewModal.countDocuments({ rating: 4 });
      const total5 = await reviewModal.countDocuments({ rating: 5 });
      const remainingReviews =
        total - 5 * req.query.page < 0 ? 0 : total - 5 * req.query.page;
      if (result) {
        return res.status(200).send({
          success: true,
          data: result,
          total1,
          total2,
          total3,
          total4,
          total5,
          total,
          page: req.query.page,
          totalPage: Math.ceil(total / 5),
          remainingReviews,
          currentReviewCount,
        });
      }
    } catch (error) {
      console.error(
        '🚀 ~ file: reviewController.js:102 ~ createReview: ~ error:',
        error
      );
      return res.status(400).send({
        success: false,
        message: 'something went wrong',
        error,
      });
    }
  },
  getAllCategories: async (req, res) => {
    try {
      if (req.body.category.length > 0) {
        let category = await req.body.category.map(async (data) => {
          const result = await reviewModal.countDocuments({
            [data]: true,
            productid: req.body.id,
          });

          return { [data]: result };
        });
        const totalReviews = await reviewModal.countDocuments({
          productid: req.body.id,
        });
        category = await Promise.all(category);
        const catObj = {};
        category.forEach((element) => {
          for (let key in element) {
            catObj[key] = element[key];
          }
        });

        res.status(200).send({
          success: true,
          data: catObj,
          totalReviews,
        });
      }
    } catch (error) {
      res.status(400).send({
        success: false,
        error,
      });
    }
  },
  getAllCategories1: async (req, res) => {
    try {
      req.query.category = JSON.parse(req.query.category);
      if (req.query.category.length > 0) {
        let category = await req.query.category.map(async (data) => {
          const result = await reviewModal.countDocuments({
            [data]: true,
            productid: req.query.id,
          });

          return { [data]: result };
        });
        const totalReviews = await reviewModal.countDocuments({
          productid: req.query.id,
        });
        category = await Promise.all(category);
        const catObj = {};
        category.forEach((element) => {
          for (let key in element) {
            catObj[key] = element[key];
          }
        });

        res.status(200).send({
          success: true,
          data: catObj,
          totalReviews,
        });
      }
    } catch (error) {
      res.status(400).send({
        success: false,
        error,
      });
    }
  },
  getOneReview: async (req, res) => {
    try {
      const result = await reviewModal.find({
        userid: req.body.userid,
        productid: req.body.productid,
      });
      if (result) {
        return res.status(200).send({
          success: true,
          data: result,
        });
      }
    } catch (error) {
      console.error(
        '🚀 ~ file: reviewController.js:102 ~ createReview: ~ error:',
        error
      );
      return res.status(400).send({
        success: false,
        message: 'something went wrong',
        error,
      });
    }
  },
  getOneReview1: async (req, res) => {
    try {
      const result = await reviewModal.find({
        userid: req.query.userid,
        productid: req.query.productid,
      });
      if (result) {
        return res.status(200).send({
          success: true,
          data: result,
        });
      }
    } catch (error) {
      console.error(
        '🚀 ~ file: reviewController.js:102 ~ createReview: ~ error:',
        error
      );
      return res.status(400).send({
        success: false,
        message: 'something went wrong',
        error,
      });
    }
  },
  createReview: async (req, res) => {
    try {
      const {
        userid,
        productid,
        reviewBody,
        reviewTitle,
        rating,
        type,
        profilePic,
        name,
        valueForMoney,
        fabricQuality,
        colors,
        clothStyle,
        comfort,
        food,
        banquet,
        hospitality,
        staff,
        qualitywork,
        professionalism,
        onTime,
      } = req.body;
      if (
        !userid ||
        !productid ||
        !reviewBody ||
        !reviewTitle ||
        !rating ||
        !type ||
        !name
      ) {
        return res.status(400).send({
          success: false,
          message: 'invalid inputs',
        });
      }

      const review = await reviewModal.create({
        userid,
        productid,
        reviewBody,
        reviewTitle,
        rating,
        profilePic,
        name,
        type,
        valueForMoney,
        fabricQuality,
        colors,
        clothStyle,
        comfort,
        food,
        banquet,
        hospitality,
        staff,
        qualitywork,
        professionalism,
        onTime,
      });

      if (type === 'product') {
        const product = await productModel.findById(productid);
        if (product) {
          product.avgRating;
          const avgRatingTotalStars = rating + product.avgRatingTotalStars;
          const avgRatingTotalRates = product.avgRatingTotalRates + 1;
          const avgRating = avgRatingTotalStars / avgRatingTotalRates;
          await productModel.findByIdAndUpdate(productid, {
            avgRating,
            avgRatingTotalStars,
            avgRatingTotalRates,
          });

          return res.status(200).send({
            success: true,
            data: review,
          });
        }
      } else if (type === 'venue') {
        const product = await venueModal.findById(productid);
        if (product) {
          product.avgRating;
          const avgRatingTotalStars = rating + product.avgRatingTotalStars;
          const avgRatingTotalRates = product.avgRatingTotalRates + 1;
          const avgRating = avgRatingTotalStars / avgRatingTotalRates;
          await venueModal.findByIdAndUpdate(productid, {
            avgRating,
            avgRatingTotalStars,
            avgRatingTotalRates,
          });
          return res.status(200).send({
            success: true,
            data: review,
          });
        }
      } else {
        const product = await vendorModal.findById(productid);
        if (product) {
          product.avgRating;
          const avgRatingTotalStars = rating + product.avgRatingTotalStars;
          const avgRatingTotalRates = product.avgRatingTotalRates + 1;
          const avgRating = avgRatingTotalStars / avgRatingTotalRates;
          await vendorModal.findByIdAndUpdate(productid, {
            avgRating,
            avgRatingTotalStars,
            avgRatingTotalRates,
          });
          return res.status(200).send({
            success: true,
            data: review,
          });
        }
      }
    } catch (error) {
      console.error(
        '🚀 ~ file: reviewController.js:102 ~ createReview: ~ error:',
        error
      );
      return res.status(400).send({
        success: false,
        message: 'something went wrong',
        error,
      });
    }
  },
  updateReview: async (req, res) => {
    try {
      const {
        reviewBody,
        reviewTitle,
        rating,
        _id,
        valueForMoney,
        fabricQuality,
        colors,
        clothStyle,
        comfort,
        food,
        banquet,
        hospitality,
        staff,
        qualitywork,
        professionalism,
        onTime,
      } = req.body;
      if (!reviewBody || !reviewTitle || !rating || !_id) {
        return res.status(400).send({
          success: false,
          message: 'invalid inputs',
        });
      }

      const review = await reviewModal.findByIdAndUpdate(_id, {
        reviewBody,
        reviewTitle,
        rating,
        valueForMoney,
        fabricQuality,
        colors,
        clothStyle,
        comfort,
        food,
        banquet,
        hospitality,
        staff,
        qualitywork,
        professionalism,
        onTime,
      });

      if (review.type === 'product') {
        const product = await productModel.findById(review.productid);
        if (product) {
          const avgRatingTotalStars =
            rating + product.avgRatingTotalStars - review.rating;
          const avgRating = avgRatingTotalStars / product.avgRatingTotalRates;
          await productModel.findByIdAndUpdate(review.productid, {
            avgRating,
            avgRatingTotalStars,
          });

          return res.status(200).send({
            success: true,
            data: review,
          });
        }
      } else if (type == 'venue') {
        const product = await venueModal.findById(review.productid);
        if (product) {
          const avgRatingTotalStars =
            rating + product.avgRatingTotalStars - review.rating;
          const avgRating = avgRatingTotalStars / product.avgRatingTotalRates;
          await venueModal.findByIdAndUpdate(review.productid, {
            avgRating,
            avgRatingTotalStars,
          });

          return res.status(200).send({
            success: true,
            data: review,
          });
        }
      } else {
        const product = await vendorModal.findById(review.productid);
        if (product) {
          const avgRatingTotalStars =
            rating + product.avgRatingTotalStars - review.rating;
          const avgRating = avgRatingTotalStars / product.avgRatingTotalRates;
          await vendorModal.findByIdAndUpdate(review.productid, {
            avgRating,
            avgRatingTotalStars,
          });

          return res.status(200).send({
            success: true,
            data: review,
          });
        }
      }
    } catch (error) {
      console.error(
        '🚀 ~ file: reviewController.js:102 ~ createReview: ~ error:',
        error
      );
      return res.status(400).send({
        success: false,
        message: 'something went wrong',
        error,
      });
    }
  },
  deleteReview: async (req, res) => {
    try {
      if (!req.params.id) {
        return res.status(400).send({
          success: false,
          message: 'invalid inputs',
        });
      }

      const review = await reviewModal.findByIdAndDelete(req.params.id);

      if (review.type === 'product') {
        const product = await productModel.findById(review.productid);
        if (product) {
          let avgRating;
          const avgRatingTotalStars =
            product.avgRatingTotalStars - review.rating;
          const avgRatingTotalRates = product.avgRatingTotalRates - 1;

          if (avgRatingTotalStars === 0 && avgRatingTotalRates === 0) {
            avgRating = 0;
          } else {
            avgRating = avgRatingTotalStars / avgRatingTotalRates;
          }

          await productModel.findByIdAndUpdate(review.productid, {
            avgRating,
            avgRatingTotalStars,
            avgRatingTotalRates,
          });

          return res.status(200).send({
            success: true,
          });
        }
      } else if ((type = 'venue')) {
        const product = await venueModal.findById(review.productid);

        if (product) {
          let avgRating;
          const avgRatingTotalStars =
            product.avgRatingTotalStars - review.rating;
          const avgRatingTotalRates = product.avgRatingTotalRates - 1;

          if (avgRatingTotalStars === 0 && avgRatingTotalRates === 0) {
            avgRating = 0;
          } else {
            avgRating = avgRatingTotalStars / avgRatingTotalRates;
          }

          await venueModal.findByIdAndUpdate(review.productid, {
            avgRating,
            avgRatingTotalStars,
            avgRatingTotalRates,
          });

          return res.status(200).send({
            success: true,
          });
        }
      } else {
        const product = await vendorModal.findById(review.productid);

        if (product) {
          let avgRating;
          const avgRatingTotalStars =
            product.avgRatingTotalStars - review.rating;
          const avgRatingTotalRates = product.avgRatingTotalRates - 1;

          if (avgRatingTotalStars === 0 && avgRatingTotalRates === 0) {
            avgRating = 0;
          } else {
            avgRating = avgRatingTotalStars / avgRatingTotalRates;
          }

          await vendorModal.findByIdAndUpdate(review.productid, {
            avgRating,
            avgRatingTotalStars,
            avgRatingTotalRates,
          });

          return res.status(200).send({
            success: true,
          });
        }
      }
    } catch (error) {
      console.error(
        '🚀 ~ file: reviewController.js:102 ~ createReview: ~ error:',
        error
      );
      return res.status(400).send({
        success: false,
        message: 'something went wrong',
        error,
      });
    }
  },
  getAllReplies: async (req, res) => {
    try {
      condition = {};
      req.body.reviewid ? (condition.reviewid = req.body.reviewid) : null;
      const result = await replyModal
        .find(condition)
        .skip((req.body.page - 1) * 5)
        .limit(5);
      const total = await replyModal.countDocuments(condition);
      const currentReviewCount = await replyModal
        .countDocuments(condition)
        .skip((req.body.page - 1) * 5)
        .limit(5);
      const remainingReplies =
        total - 5 * req.body.page < 0 ? 0 : total - 5 * req.body.page;
      if (result) {
        return res.status(200).send({
          success: true,
          data: result,
          total,
          page: req.body.page,
          totalPage: Math.ceil(total / 5),
          remainingReplies,
          currentReviewCount,
        });
      }
    } catch (error) {
      console.error(
        '🚀 ~ file: reviewController.js:102 ~ createReview: ~ error:',
        error
      );
      return res.status(400).send({
        success: false,
        message: 'something went wrong',
        error,
      });
    }
  },
  getOneReplies: async (req, res) => {
    try {
      const result = await replyModal.findById(req.params.id);
      if (result) {
        return res.status(200).send({
          success: true,
          data: result,
        });
      }
    } catch (error) {
      console.error(
        '🚀 ~ file: reviewController.js:102 ~ createReview: ~ error:',
        error
      );
      return res.status(400).send({
        success: false,
        message: 'something went wrong',
        error,
      });
    }
  },
  createReplies: async (req, res) => {
    try {
      const { userid, reviewid, replyBody, profilePic, name } = req.body;
      if (!userid || !reviewid || !replyBody || !name) {
        return res.status(400).send({
          success: false,
          message: 'invalid inputs',
        });
      }

      const reply = await replyModal.create({
        userid,
        reviewid,
        replyBody,
        profilePic,
        name,
      });
      if (reply) {
        return res.status(200).send({
          success: true,
          data: reply,
        });
      }
    } catch (error) {
      return res.status(400).send({
        success: false,
        message: 'something went wrong',
      });
    }
  },
  updateReplies: async (req, res) => {
    try {
      const { replyBody, _id } = req.body;
      if (!replyBody || !_id) {
        return res.status(400).send({
          success: false,
          message: 'invalid inputs',
        });
      }

      const reply = await replyModal.findByIdAndUpdate(_id, {
        replyBody,
      });
      if (reply) {
        return res.status(200).send({
          success: true,
        });
      }
    } catch (error) {
      return res.status(400).send({
        success: false,
        message: 'something went wrong',
      });
    }
  },
  deleteReplies: async (req, res) => {
    try {
      const { id: _id } = req.params;
      if (!_id) {
        return res.status(400).send({
          success: false,
          message: 'invalid inputs',
        });
      }

      const reply = await replyModal.findByIdAndDelete(_id);
      if (reply) {
        return res.status(200).send({
          success: true,
        });
      }
    } catch (error) {
      return res.status(400).send({
        success: false,
        message: 'something went wrong',
      });
    }
  },
};
