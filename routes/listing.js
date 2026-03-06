const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const {isLoggedIn, isOwner} = require("../middleware.js")

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

//Index Route
router.get("/",wrapAsync
     (async (req, res) => {
        let allListings = await Listing.find({});
        
        res.render("listings/index", { allListings });
}));

//New Route
router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new.ejs");
})

//Edit Route 
router.get("/:id/edit", 
    isLoggedIn,
    wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!")
        return res.redirect("/listings")
    }
    req.flash("success", "Listing Updated!")
    res.render("listings/edit.ejs", {listing});
}));

//Show Route

router.get("/:id",wrapAsync
     (async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id)
        .populate({path: 'reviews', 
            populate: {
                path: "author"
            }
        })
        .populate("owner")
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!")
        res.redirect("/listings")
    } else  {
            res.render("listings/show.ejs", { listing })

    }
}));

//Create Route 
router.post("/", 
    validateListing , 
    wrapAsync
    ( async (req, res) => {

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created!")
    res.redirect("/listings");
}));



//Update Route 
router.put("/:id", 
    isLoggedIn,
    isOwner,
    validateListing ,
    wrapAsync
     (async (req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id , { ...req.body.listing });
    req.flash("success", "Listing Updated!")
    res.redirect(`/listings/${id}`);
    
    
}));

//Delete Route
router.delete("/:id",
    isLoggedIn,
    isOwner,
    wrapAsync
    (async (req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing deleted successfully");
    res.redirect("/listings");
}));

module.exports = router