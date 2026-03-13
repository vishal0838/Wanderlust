const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing.js");

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const {isLoggedIn, validateReview,isReviewAuthor} = require("../middleware.js");
const revriewControllers = require("../controllers/review.js")




//Post Review Route
router.post("/", 
    isLoggedIn,
    validateReview,
    wrapAsync
    (revriewControllers.postReviewR ));

//Review Delete Route


router.delete("/:reviewId",
    isLoggedIn,
    isReviewAuthor,
     wrapAsync(revriewControllers.deleteRoute));


module.exports = router;