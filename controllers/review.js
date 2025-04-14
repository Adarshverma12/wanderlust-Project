const Listen = require("../models/listening.js");
const Review = require("../models/review.js");

// for review listen
module.exports.createReview = async (req, res) => {
    let listenId = await Listen.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listenId.reviews.push(newReview);
    await newReview.save();
    await listenId.save();
    req.flash("success", "Review added!");
    res.redirect(`/listening/${listenId._id}`);
};

// for review deletion
module.exports.deleteReview = async(req, res) => {
    let { id, reviewId } = req.params;

    // reviewDeletionfromListen
    await Listen.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    // reviewDeletion
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully Deleted!");
    res.redirect(`/listening/${id}`);
};