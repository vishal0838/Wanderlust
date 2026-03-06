const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
    mongoose.connect(MONGO_URL);
}

main()
    .then (() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
        ...obj, owner: "69a6bb5309fe5714d5d1d9dc"
    }));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}

initDB();