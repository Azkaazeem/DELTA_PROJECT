const User = require("../models/user.js");

// SIGNUP ROUTE
module.exports.signupIndex = (req, res) => {
    res.render("users/signup.ejs");
}

module.exports.signupRoute = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if(err) {
                return next(err);
            }
            req.flash("success", "Welcome to wanderlust!");
            res.redirect("/listings");
        });
        console.log(registeredUser);


    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup")
    }
}

// LOGIN ROUTE
module.exports.loginIndex = (req, res) => {
    res.render("users/login.ejs");
}

module.exports.loginRoute = async (req, res) => {
    req.flash("success", "Welcome back to wanderlust!");
    let redirectUrl = res.locals.redirectURL || "/listings";
    res.redirect(redirectUrl);
}

// LOGOUT
module.exports.logoutRoute =  (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err)
        }
        req.flash("success", "you are logged out!");
        res.redirect("/listings");
    })
}