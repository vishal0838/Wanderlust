const Listing = require("../models/listing.js");
// const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
// const mapToken = process.env.MAP_TOKEN;
// const geocodingClient = mbxGeocoding({ accessToken: mapToken });


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

    let originalImageUrl = listing.image.url; 
    originalImageUrl = originalImageUrl.replace("/uploads", "/upload/h_300,w_250");
    req.flash("success", "Listing Updated!")
    res.render("listings/edit.ejs", {listing, originalImageUrl});
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
    // let response = await geocodingClient.forwardGeocode({
    //     query: 'New Delhi, India',
    //     limit: 1,
    // })
    //     .send()
    // console.log(response.body.features[0].geometry);
    // res.send("done")
    
  
    
    let url = req.file.path;
    
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created!")
    res.redirect("/listings");
};

module.exports.update = async (req,res) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id , { ...req.body.listing });

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }

    

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