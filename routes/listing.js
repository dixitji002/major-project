const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner,listingValidation} = require("../middleware.js");
const controllerListing = require("../collections/listing.js");

const multer  = require('multer')
const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

router
    .route("/")
    .get( controllerListing.index)
    .post(isLoggedIn, listingValidation, upload.single("listing[image]"), wrapAsync(controllerListing.createListing));
    

router.get("/new", isLoggedIn,controllerListing.renderNewForm);
router.get("/search", wrapAsync(controllerListing.SearchLocation));





// show rout
router
    .route("/:id")
    .get( wrapAsync(controllerListing.showListing))
    .put(isLoggedIn,isOwner,
        upload.single("listing[image]"),
        listingValidation,
        wrapAsync(controllerListing.updateListing)    
    )
    .delete(isLoggedIn,isOwner,
        wrapAsync(controllerListing.destroyListing)    
    )

router.get("/:id/edit",isLoggedIn, isOwner,wrapAsync(controllerListing.renderEditForm));

module.exports = router;