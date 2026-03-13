const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
        let allListings = await Listing.find({});
        
        res.render("listings/index", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.edit = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!")
        return res.redirect("/listings")
    }
    req.flash("success", "Listing Updated!")
    res.render("listings/edit.ejs", {listing});
};

module.exports.show = async (req, res) => {
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
};

module.exports.create = async (req, res) => {

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created!")
    res.redirect("/listings");
};

module.exports.update = async (req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id , { ...req.body.listing });
    req.flash("success", "Listing Updated!")
    res.redirect(`/listings/${id}`);
    
    
};

module.exports.delete = async (req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing deleted successfully");
    res.redirect("/listings");
};