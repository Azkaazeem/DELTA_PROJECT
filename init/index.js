const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const path = require("path");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
.then(() => {console.log("Connected to DB")})
.catch((err) => {console.log(err)});

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    
    // Map over the data to extract the url from the image object
    const mappedData = initData.data.map((obj) => ({
        ...obj,
        image: obj.image.url, owner: "6a38f03845599b09710bfd40"
    }))
    
    await Listing.deleteMany({});
    await Listing.insertMany(mappedData);
    console.log("Data was initialized");
};

initDB();