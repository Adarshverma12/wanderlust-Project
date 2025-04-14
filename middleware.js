const Listen = require("./models/listening.js");
const Review = require("./models/review.js");
const { reviewValidation, schemaValidation } = require("./schema.js");
module.exports.loggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.NewredirectUrl = req.originalUrl;
        req.flash("error", "You must be loggedIn");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.NewredirectUrl) {
        res.locals.NewredirectUrl = req.session.NewredirectUrl;
    }
    next();
};
module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    const listening = await Listen.findById(id);
    if (!listening.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "you don't have access to listening");
        return res.redirect(`/listening/${id}`)
    }
    next();
};
module.exports.listingValidation = ((req, res, next) => {
    const result = schemaValidation.validate(req.body);

    if (result.error) {
        throw new ExpressError(400, result.error);
    }

    next();
});
module.exports.ReviewValidation = ((req, res, next) => {
    const result = reviewValidation.validate(req.body);

    if (result.error) {
        throw new ExpressError(400, result.error);
    }

    next();
});

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author._id.equals(res.locals.currUser._id)) {
        req.flash("error", "you don't have access to delete listening");
        return res.redirect(`/listening/${id}`)
    }
    next();
};