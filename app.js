if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

console.log(process.env);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const reviewRouter = require("./routes/reviewRouter.js");
const listingsRouter =  require("./routes/listingRouter.js");
const userRouter =  require("./routes/userRouter.js");
const session = require("express-session");
const { MongoStore } = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const { getMaxListeners } = require("cluster");
const { log } = require("console");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLAS_CONNECTION_URL

// import dns from 'dns'
const dns = require('dns');
dns.setServers(['8.8.8.8','1.1.1.1'])

main()
    .then(() => { console.log("Connected to DB") })
    .catch((err) => { console.log(err) });

async function main() {
    await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// app.get("/", (req, res) => {
//     res.send("Running successfully!");
//     console.log("Backend is running successfully!");
// })

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {secret: process.env.SECRET_CODE},
    touchAfter: 24 * 3600,
});

store.on("error" , () => {
    console.log("ERROR IN MONGO SESSION" , err)
});

const sessionOptions = {
    store,
    secret: process.env.SECRET_CODE,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expire: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    }
}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req , res , next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    res.locals.MAPTILER_API = process.env.MAPTILER_API;
    next();
})

app.get("/demouser" , async (req , res) => {
    let fakeUser = new User({
        email: "demo@gmail.com",
        username: "demo",
    })

    let registerUser = await User.register(fakeUser , "helloworld");
    res.send(registerUser);
})

app.use("/listings" , listingsRouter);
app.use("/listings/:id/reviews" , reviewRouter);
app.use("/" , userRouter);

app.all(/.*/, (req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs", { message });
});

app.listen("8080", () => {
    console.log("app is listening on port 8080");
});
