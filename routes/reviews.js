const express = require("express");
const routes = express.Router({mergeParams: true});
const Review = require("../models/review.js");
const Listen = require("../models/listening.js");
const wrapAsync = require("../ErrorFiles/wrapAsync.js");
const { loggedIn, ReviewValidation, isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/review.js");

// 1) review listen route
routes.post("/",loggedIn, ReviewValidation, wrapAsync(reviewController.createReview));

// 2) review deletion route
routes.delete("/:reviewId",loggedIn, isReviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports = routes;