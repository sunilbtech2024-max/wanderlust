const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError.js"); // 👈 Upar global import karein
 const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
 const mapToken = process.env.MAP_TOKEN;
 const geocodingClient = mbxGeocoding({ accessToken: mapToken });
// 1. Index Route

module.exports.index = async (req, res) => {
  let { country } = req.query;

  let allListings;

  if (country) {
    allListings = await Listing.find({
      country: { $regex: country, $options: "i" }
    });
  } else {
    allListings = await Listing.find({});
  }

  res.render("listing/index.ejs", { allListings });
};

// 2. New Form Route
module.exports.renderNewForm = (req, res) => {
  res.render("listing/new.ejs");
};

// 3. Show Route
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }
  res.render("listing/show.ejs", { listing });
};

// 4. Create Route
module.exports.createListing = async (req, res) => {

  console.log("GEOMETRY SCHEMA:", Listing.schema.path("geometry"));
  let response = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1,
  }).send();

 
  
 

  let url = req.file.path;
  let filename = req.file.filename;
  console.log(url, "..",filename);
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
   newListing.image = { url, filename };
    
   newListing.geometry = response.body.features[0].geometry;
   
  let savedListing = await newListing.save();
  
  console.log(savedListing);
  req.flash("success", "New listing Created!");
  res.redirect("/listings");
};

// 5. Edit Route
module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }
  let originalImageUrl= listing.image.url;
 originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250");
  res.render("listing/edit.ejs", { listing, originalImageUrl });
};

// 6. Update Route
module.exports.updateListing = async (req, res) => {
  if (!req.body.listing) {
    throw new ExpressError(400, "Send valid data for listing");
  }
  let { id } = req.params;
  let listing=await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
     await listing.save();
  }
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

// 7. Delete Route
module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deleteListing = await Listing.findByIdAndDelete(id);
  console.log(deleteListing);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};