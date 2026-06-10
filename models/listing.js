const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title:{
        type: String,
        required: true,
    },
    description: String,
    image: {
        type: String,
        default: "https://i.pinimg.com/736x/43/14/0a/43140a3803e5f1b39c1ffac1a35a3ec7.jpg",
        set: (v) => v === "" ? "https://i.pinimg.com/736x/43/14/0a/43140a3803e5f1b39c1ffac1a35a3ec7.jpg" : v,
    },
    price: Number,
    country: String,
    location: String
});

const Listing = mongoose.model("Listing" , listingSchema);
module.exports = Listing;