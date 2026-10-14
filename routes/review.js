const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");

const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/review.js"); // 👈 Exact file name: review.js

// Safe Fallback Function (Agar createdReview / createReview dono me se koi ek ho)
const postReviewHandler = reviewController.createdReview || reviewController.createReview;

// Reviews - Post review route
router.post(
  "/", 
  isLoggedIn,
  validateReview,
  wrapAsync(postReviewHandler)
);

// Delete review route
router.delete(
  "/:reviewId",
  isLoggedIn, 
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;