const Listing = require("../models/listing.js");

// LISTINGS CONTROLLERS
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listing/index.ejs", { allListings });
};

module.exports.newListing = (req, res) => {
    res.render("./listing/new.ejs")
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!")
        return res.redirect("/listings");
    }
    res.render("./listing/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
    let url = req.file ? req.file.path : "";
    let filename = req.file ? req.file.filename : "";
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url , filename };
    await newListing.save();
    req.flash("success", "New Listing created successfully");
    res.redirect("/listings");
}

module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!")
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image?.url || "";
    if (originalImageUrl) {
        originalImageUrl = originalImageUrl.replace("/upload" , "/upload/w_250");
    }
    req.flash("success", "Edit successfully");
    res.render("listing/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url , filename };
        await listing.save();
    }
    req.flash("success", "Update successfully");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Delete successfully");
    res.redirect("/listings");
}