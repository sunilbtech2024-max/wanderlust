const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");

const Mongo_Url=process.env.ATLASDB_URL || "mongodb://localhost:27017/wanderlust";

async function initDB() {
  await Listing.deleteMany({});

  const listings = initData.data.map((listing) => ({
    ...listing,
    owner: "6ac21c7b11c1b0e9ab817645",
  }));

  await Listing.insertMany(listings);
  console.log("Data was initialized");
}

async function main() {
  try {
    await mongoose.connect(Mongo_Url);
    console.log("connected to db");
    await initDB();
  } catch (err) {
    console.error("Failed to initialize database:", err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

main();