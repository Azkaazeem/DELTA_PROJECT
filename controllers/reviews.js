const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");

// REVIEW CONTROLLERS
module.exports.index = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    console.log(req.body.review);

    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    console.log("New Review Saved");
    req.flash("success", "New Review created successfully");
    res.redirect(`/listings/${req.params.id}`);
}

module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, {
        $pull: {
            reviews: reviewId
        }
    });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Delete successfully");
    res.redirect(`/listings/${id}`);
}