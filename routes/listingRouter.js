const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn , validateListing , isOwner} = require("../middleware.js");
const listingController = require("../controllers/listings.js");


// INDEX ROUTE 
router.get("/", listingController.index);

// NEW ROUTE
router.get("/new", isLoggedIn , listingController.newListing);

// SHOW ROUTE
router.get("/:id", listingController.showListing);

// CREATE ROUTE
router.post("/", validateListing, isLoggedIn , wrapAsync(listingController.createListing));

// EDIT ROUTE
router.get("/:id/edit", isLoggedIn , isOwner , listingController.editListing);

// UPDATE ROUTE
router.put("/:id", isLoggedIn , isOwner , validateListing, wrapAsync(listingController.updateListing));

// // DELETE ROUTE
router.delete("/:id", isLoggedIn , isOwner , listingController.destroyListing);

module.exports = router;