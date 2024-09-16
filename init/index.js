const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

main().then(() => {
    console.log("Connected to the database");
}).catch((err) => {
    console.error("Database connection error:", err);
});

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderLust");
}
const initDB = async()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj,owner:"66e407f6165d19e5a9439088"}));
    await Listing.insertMany(initData.data);
    console.log("data was saved");

}
initDB();