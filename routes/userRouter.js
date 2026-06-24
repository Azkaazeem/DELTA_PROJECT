const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectURL } = require("../middleware.js");
const userController = require("../controllers/users.js");

// SIGNUP ROUTE
router.route("/signup")
.get(userController.signupIndex)
.post(wrapAsync(userController.signupRoute))

// LOGIN ROUTE
router.route("/login")
.get(userController.loginIndex)
.post(saveRedirectURL, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), userController.loginRoute);

// LOGOUT ROUTE
router.get("/logout", userController.logoutRoute);

module.exports = router;