const express = require('express');
const rrControler = require('../controllers/reviewController.js');

const router = express.Router();

router.post('/reviews', rrControler.createReview);
router.post('/reviews/all', rrControler.getAllReview);
router.get('/reviews/all', rrControler.getAllReview1);
router.post('/reviews/getCat', rrControler.getAllCategories);
router.get('/reviews/getCat', rrControler.getAllCategories1);
router.post('/reviews/one', rrControler.getOneReview);
router.get('/reviews/one', rrControler.getOneReview1);
router.put('/reviews', rrControler.updateReview);
router.delete('/reviews/:id', rrControler.deleteReview);

router.post('/replies/all', rrControler.getAllReplies);
router.get('/replies/:id', rrControler.getOneReplies);
router.post('/replies', rrControler.createReplies);
router.put('/replies', rrControler.updateReplies);
router.delete('/replies/:id', rrControler.deleteReplies);

module.exports = router;
