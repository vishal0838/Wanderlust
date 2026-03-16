const express = require("express");

const router = express.Router();
const Listing = require("../models/listing.js");
const {storage} = require("../cloudconfig.js");

const multer = require("multer");
const upload = multer({ storage });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const {isLoggedIn, isOwner} = require("../middleware.js");
const listingControllers = require("../controllers/listing.js");

//Listing Validation
const validateListing  = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);

    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg)
        
    } else {
        next();
    }

    console.log(error);
}

router
    .route("/")
    .get(wrapAsync(listingControllers.index))
    .post(
        isLoggedIn, 
         
        upload.single("listing[image][url]"),
        validateListing,
        wrapAsync(listingControllers.create)
    )


//New Route
router.get("/new", isLoggedIn, listingControllers.renderNewForm);

//Search Bar Route
router.get("/search", wrapAsync(async (req, res) => {
    let { destination } = req.query;

    const listing = await Listing.findOne({
        $or: [
            { title: { $regex: destination, $options: "i" } },
            { location: { $regex: destination, $options: "i" } },
            { country: { $regex: destination, $options: "i" } }
        ]
    });

    if(listing) {
        res.redirect(`/listings/${listing._id}`);
    } else {
        res.send("Listing not found");
    }
}));

router.route("/:id")
    .get(wrapAsync(listingControllers.show))
    .put(isLoggedIn,isOwner,upload.single("listing[image][url]"),validateListing ,wrapAsync(listingControllers.update))
    .delete(isLoggedIn,isOwner,wrapAsync(listingControllers.delete));




//Edit Route 
router.get("/:id/edit", isLoggedIn, wrapAsync(listingControllers.edit));

//Show Route

router





//Update Route 
router

//Delete Route
router

module.exports = router