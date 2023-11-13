const express = require('express');
const router = express.Router();
const reviewController = require('./reviewController');

router.post('/addreview', reviewController.addReview);
router.get('/product/:productId', reviewController.getReviewsByProduct);
router.get('/user/:userId/:userEmail', reviewController.getReviewsByUserId);
router.get('/getreviewidwithuserid/:userId/:userEmail/:revId', reviewController.getReviewByUserIdAndReviewId);
router.patch('/reviewupdate', reviewController.updateReview);
router.delete('/deletereview/:userId/:userEmail/:revId', reviewController.deleteReviewsByUserId);

module.exports = router;
