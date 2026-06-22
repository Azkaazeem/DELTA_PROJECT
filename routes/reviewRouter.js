const express = require("express");
const router = express.Router({ mergeParams: true});
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");

const validateReview = (req, res, next) => { 
    let { error } = reviewSchema.validate(req.body); 
    if (error) { 
        let errMsg = error.details.map((el) => el.message).join(","); 
        throw new ExpressError(400, errMsg); 
    } else {
        next(); 
    } 
};

// POST ROUTE
router.post("/", validateReview , wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    console.log(req.body.review);

    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    console.log("New Review Saved");
    req.flash("success" , "New Review created successfully");
    res.redirect(`/listings/${req.params.id}`);
}));

// DELETE ROUTE
router.delete("/:reviewId" , wrapAsync(
    async(req,res) => {
        let { id , reviewId } = req.params;
        await Listing.findByIdAndUpdate(id , {
            $pull: {
                reviews: reviewId
            }
        });
        await Review.findByIdAndDelete(reviewId);
        req.flash("success" , "Delete successfully");
        res.redirect(`/listings/${id}`);
    }
));

module.exports = router;