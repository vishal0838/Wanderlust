const mongoose = require("mongoose");
const initData = require("./data.js");
require("dotenv").config();
const Listing = require("../models/listing.js");

const dburl = process.env.ATLASDB_URL


async function main() {
    mongoose.connect(dburl);
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