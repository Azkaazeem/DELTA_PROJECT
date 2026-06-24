const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn , validateListing , isOwner} = require("../middleware.js");


// INDEX ROUTE 
router.get("/", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listing/index.ejs", { allListings });
});

// NEW ROUTE
router.get("/new", isLoggedIn , (req, res) => {
    res.render("./listing/new.ejs")
})

// SHOW ROUTE
router.get("/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews" , populate:{path:"author"}}).populate("owner");
    if(!listing) {
        req.flash("error" , "Listing you requested for does not exist!")
        return res.redirect("/listings");
    }
    res.render("./listing/show.ejs", { listing });
})

// CREATE ROUTE
router.post("/", validateListing, isLoggedIn , wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success" , "New Listing created successfully");
    res.redirect("/listings");
}));

// EDIT ROUTE
router.get("/:id/edit", isLoggedIn , isOwner , async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error" , "Listing you requested for does not exist!")
        return res.redirect("/listings");
    }
    req.flash("success" , "Edit successfully");
    res.render("listing/edit.ejs", { listing });
});

// UPDATE ROUTE
router.put("/:id", isLoggedIn , isOwner , validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success" , "Update successfully");
    res.redirect(`/listings/${id}`);
}));

// // DELETE ROUTE
router.delete("/:id", isLoggedIn , isOwner , async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success" , "Delete successfully");
    res.redirect("/listings");
})

module.exports = router;