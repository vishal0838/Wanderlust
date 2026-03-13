const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");

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
    .post(isLoggedIn, validateListing , wrapAsync(listingControllers.create))


//New Route
router.get("/new", isLoggedIn, listingControllers.renderNewForm);


router.route("/:id")
    .get(wrapAsync(listingControllers.show))
    .put(isLoggedIn,isOwner,validateListing ,wrapAsync(listingControllers.update))
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