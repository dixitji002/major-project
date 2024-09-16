const Review = require("../models/review");
const Listing = require("../models/listing");

module.exports.createReview = async (req, res) => {
    const { id } = req.params;

    // Find the listing by ID
    const listing = await Listing.findById(id);
    
    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }

    // Create new review
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    
    listing.reviews.push(newReview);

    // Save both review and listing
    await newReview.save();
    await listing.save();

    // Redirect to the listing page
    req.flash("success", "New Review created!");
    res.redirect(`/listing/${id}`);
};

module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;
    
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!");
    res.redirect(`/listing/${id}`);
};