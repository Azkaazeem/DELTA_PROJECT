const express = require("express");
const router = express.Router({ mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const { validateReview, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

// POST ROUTE
router.post("/", validateReview , wrapAsync(reviewController.index));

// DELETE ROUTE
router.delete("/:reviewId" , isReviewAuthor , wrapAsync(reviewController.destroyReview));

module.exports = router;