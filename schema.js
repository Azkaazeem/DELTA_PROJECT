const Joi = require("joi");

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().allow("", null),
        category: Joi.string().valid("Trendings", "Rooms", "Mountains", "Farms", "Villa", "Apartment", "Beach", "Camping", "Amazing Pools", "Castles", "Skiing", "Boats", "City Views", "Forest", "Historical", "Lakefront", "Desert", "Luxury", "Tiny Homes", "Golfing", "Bed & Breakfast").required()
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required(),
});