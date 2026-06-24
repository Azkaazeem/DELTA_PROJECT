const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectURL } = require("../middleware.js");
const userController = require("../controllers/users.js");

router.get("/signup", userController.signupIndex);

router.post("/signup", wrapAsync(userController.signupRoute));

router.get("/login", userController.loginIndex);

router.post("/login", saveRedirectURL, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), userController.loginRoute);

router.get("/logout", userController.logoutRoute);

module.exports = router;