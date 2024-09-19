const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError.js");
const cloudinary = require('../cloudConfig');


module.exports.index = async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
};

module.exports.renderNewForm = (req, res) => { 
    
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    const { id } = req.params;

    // Check if ID is a valid MongoDB ObjectId
    
    const listing = await Listing.findById(id)
    .populate({
        path: "reviews",
        populate: { path: "author" },
        options: { strictPopulate: false }
    })
    .populate("owner");
    
    if(!listing){
        req.flash("error", "LIsting you requisted for does not exist!");
        return res.redirect("/listing")
    }
    res.render("listings/show.ejs", { listing });
}

module.exports.createListing = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        const result = await cloudinary.uploader.upload(req.file.path);

        const url = result.secure_url;
        const filename = result.public_id;

        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = { url, filename };
        await newListing.save();

        req.flash("success", "New Listing Created!");
        res.redirect("/listing");
    } catch (error) {
        console.error("Error creating listing:", error);
        next(error);
    }
};


module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listing");
    }
    res.render("listings/edit.ejs", { listing });
};

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    
    if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);  // Use req.file.path for Cloudinary upload
        const url = result.secure_url;  // This is the URL of the uploaded image on Cloudinary
        const filename = result.public_id;  // Public ID of the file in Cloudinary
    
        listing.image = { url, filename };  // Save the URL and filename in the database
        await listing.save();
    }

    req.flash("success", "Listing Updated!");
    res.redirect(`/listing/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listing");
};

module.exports.SearchLocation = async (req, res) => {
    const { location } = req.query;

    if (!location) {
        req.flash('error', 'Please enter a location to search.');
        return res.redirect('/listing');
    }

    // Use regular expression for case-insensitive search
    const listings = await Listing.find({ location: new RegExp(location, 'i') });

    if (!listings.length) {
        req.flash('error', 'No listings found for that location!');
        return res.redirect('/listing');
    }

    res.render('listings/searchResults', { listings });
}