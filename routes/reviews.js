const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {reviewValidation,isLoggedIn,isReviewAuthor} = require("../middleware.js")
const reviewColtroller = require("../collections/reviews.js");


router.post("/", reviewValidation, isLoggedIn,wrapAsync(reviewColtroller.createReview));
// Delete review
router.delete("/:reviewId", isLoggedIn,isReviewAuthor,wrapAsync(reviewColtroller.destroyReview));

module.exports = router;