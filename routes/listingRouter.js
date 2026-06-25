const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn , validateListing , isOwner} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { store } = require("../cloudConfig.js");
const upload = multer({ store });

// / PATHS
router.route("/")
.get(listingController.index) // INDEX ROUTE
// CREATE ROUTE
.post(isLoggedIn , upload.single("listing[image]") , validateListing , wrapAsync(
    listingController.createListing
));

// NEW ROUTE
router.get("/new", isLoggedIn , listingController.newListing);

// /:ID PATHS
router.route("/:id")
.get( listingController.showListing) // SHOW ROUTE
.put( isLoggedIn , isOwner , validateListing, wrapAsync(listingController.updateListing)) // UPDATE ROUTE
.delete( isLoggedIn , isOwner , listingController.destroyListing) // DESTROY ROUTE

// EDIT ROUTE
router.get("/:id/edit", isLoggedIn , isOwner , listingController.editListing);

module.exports = router;