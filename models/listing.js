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
        url: String,
        filename: String
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
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'] 
        },
        coordinates: {
            type: [Number]
        }
    },
    category: {
        type: String,
        enum: ["Trendings", "Rooms", "Mountains", "Beach", "Villa", "Apartment", "Camping", "AmazingPools", "Castles", "Skiing"]// " , Boats", "City Views", "Forest", "Historical", "Lakefront", "Desert", "Luxury", "Tiny Homes", "Golfing", "Bed & Breakfast"
    }
    
});

listingSchema.post("findOneAndDelete" , async (listing)=> {
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
});

const Listing = mongoose.model("Listing" , listingSchema);
module.exports = Listing;