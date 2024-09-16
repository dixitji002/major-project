const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError.js");

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
    const url = req.file.path;
    const filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listing");
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
    if(typeof req.file !== "undefined"){
        const url = req.file.path;
        const filename = req.file.filename;
        listing.image = { url, filename };
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