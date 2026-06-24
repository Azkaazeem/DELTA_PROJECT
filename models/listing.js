const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviews.js");

const listingSchema = new Schema({
    title:{
        type: String,
        required: true,
    },
    description: String,
    image: {
        type: String,
        default: "https://i.pinimg.com/736x/2e/28/9b/2e289b798932a29b741714391d84f27e.jpg",
        set: (v) => v === "" ? "https://i.pinimg.com/736x/2e/28/9b/2e289b798932a29b741714391d84f27e.jpg" : v,
    },
    price: Number,
    country: String,
    location: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Reviews"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

listingSchema.post("findOneAndDelete" , async (listing)=> {
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
});

const Listing = mongoose.model("Listing" , listingSchema);
module.exports = Listing;