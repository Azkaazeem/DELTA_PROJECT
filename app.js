const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/reviews.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(() => { console.log("Connected to DB") })
    .catch((err) => { console.log(err) });

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
    res.send("Running successfully!");
    console.log("Backend is running successfully!");
})

const validateListing = (req, res, next) => { 
    let { error } = listingSchema.validate(req.body); 
    if (error) { 
        let errMsg = error.details.map((el) => el.message).join(","); 
        throw new ExpressError(400, errMsg); 
    } else { 
        next(); 
    } 
};

const validateReview = (req, res, next) => { 
    let { error } = reviewSchema.validate(req.body); 
    if (error) { 
        let errMsg = error.details.map((el) => el.message).join(","); 
        throw new ExpressError(400, errMsg); 
    } else { 
        next(); 
    } 
};

// INDEX ROUTE 
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listing/index.ejs", { allListings });
});

// NEW ROUTE
app.get("/listings/new", (req, res) => {
    res.render("./listing/new.ejs")
})

// SHOW ROUTE
app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("./listing/show.ejs", { listing });
})

// CREATE ROUTE
app.post("/listings", wrapAsync(async (req, res, next) => {
    let result = listingSchema(req.body);
    console.log(result);
    if (result.error) {
        throw new ExpressError(400, result.error);
    }
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));

// EDIT ROUTE
app.get("/listings/:id/edit", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listing/edit.ejs", { listing });
});

// // UPDATE ROUTE
app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
})

// // DELETE ROUTE
app.delete("/listings/:id", async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
})

// POST ROUTE
app.post("/listings/:id/reviews", validateReview , wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    console.log(req.body.review);

    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    console.log("New Review Saved");
    res.redirect(`/listings/${req.params.id}`);
}));

// DELETE ROUTE
app.delete("/listings/:id/reviews/:reviewId" , wrapAsync(
    async(req,res) => {
        let { id , reviewId } = req.params;
        await Listing.findByIdAndUpdate(id , {
            $pull: {
                reviews: reviewId
            }
        });
        await Review.findByIdAndDelete(reviewId);
        res.redirect(`/listings/${id}`);
    }
));

// app.get("/testlisting" , async (req,res) => {
//     let simpleListing = new Listing({
//         title: "My New Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India"
//     })

//     await simpleListing.save();
//     console.log("sample was saved");
//     res.send("Successfully testing");
// });

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
