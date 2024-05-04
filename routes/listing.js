
const express = require("express")
const passport = require("passport")
const router = express.Router()
const wrapAsync = require("../utils/wrapAsync.js")
const { listingSchema } = require("../schema.js")
const ExpressError = require("../utils/ExpressError.js")
const Listing = require("../models/listing.js")
const { isLoggedIn } = require("../middleware.js")
const { isOwner } = require("../middleware.js")
const { resolveInclude } = require("ejs")
const multer = require("multer")
// Then const {isLoggedIn} would extract the isLoggedIn function from the exported object, making it available as a variable in the current file.
const { storage } = require("../cloudConfig.js")
const upload = multer({ storage })

// Index Route

// ya to than catch use kar lo ya to async await
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({})

    res.render("listings/index.ejs", { allListings })
})
)
router.get("/:id/yes", wrapAsync(async (req, res) => {
    let item = req.params.id
    console.log(item);
    
    
    const allListings = await Listing.find({category:item})
    console.log(allListings.length);
    
    if(allListings.length == 0){
        req.flash("error", "Currently no listings available")
        res.redirect("/")
    }
    
    res.render("listings/good.ejs", { allListings })

    
})
)

// Listings based on country

router.post("/Country", wrapAsync(async (req, res) => {
    let {Country} = req.body
    console.log(req.body);
    
    const allListings = await Listing.find({country: Country})
    
    

    res.render("listings/index.ejs", { allListings })
})
)


// NEW ROUTE

router.get("/new", isLoggedIn, async (req, res) => {



    res.render("listings/new.ejs")
})

router.post("/", upload.single("listing[image]"), wrapAsync(async (req, res, next) => {
    //    listingSchemas.validate(req.body)
    // above line ka matlab hai jo maine listingSchemas mai schema ki condition define ki hai vo sab req.body se satisfied ho rahi hai ya nahi

    let url = req.file.url;

    if (!req.body.listing) {
        throw new ExpressError(400, "Send valid data for listing")
    }
    let listing = req.body.listing;
    const newListing = new Listing(listing)
    newListing.owner = req.user._id
    if (!newListing.description) {
        throw new ExpressError(400, "Description is missing")
    }

    if (!newListing.location) {
        throw new ExpressError(400, "Location is missing")
    }
    if (!newListing.country) {
        throw new ExpressError(400, "Country is missing")
    }
    console.log(req.file)
    newListing.image = url
    // above statement means image ke andar jo url hai uske andar url set kardo and jo filename hai usme filename set kardo
    await newListing.save()
    req.flash("sucess", "New Listing Created!")
    res.redirect("/listings")

})

)









// Edit Route
router.get("/:id/edit", isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params
    const listing = await Listing.findById(id)
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!")
        res.redirect("/listings")
    }

    
    res.render("listings/edit.ejs", { listing })
})
)

// UPDATE ROUTE


router.patch("/:id", isLoggedIn, isOwner, upload.single("listing[image]"), wrapAsync(async (req, res) => {
    let { id } = req.params;
    let list = req.body.listing

    const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing })
    if (typeof req.file != "undefined") {
        // it use to check if the file is undefined or not
        let url = req.file.url;
        listing.image = url;
        await listing.save()
    }
    // ...req.body.listing  req.body.listing means ek object jiske andar values hai  ... means deconstruct karna matlab ham un values of indivisual value mai convert karege jisoko ham apne  updated values ke andar paas kar dege
    res.redirect("/listings")
})
)


// Delete Route

router.delete("/:id", wrapAsync(async (req, res) => {

    let { id } = req.params;
    if (!req.isAuthenticated()) {
        req.flash("error", "Go and login first")
        res.redirect("/login")


    }
    let listing = await Listing.findById(id)
    if (!listing.owner.equals(res.locals.currUser._id)) {

        req.flash("error", "You are not the owner of this listing")
        return res.redirect(`/listings/${id}`)


    }
    if (listing.owner.equals(res.locals.currUser._id)) {


        let deletedListing = await Listing.findByIdAndDelete(id);
        console.log(deletedListing);
        req.flash("sucess", "Listing Deleted!");
        res.redirect("/listings");

    }


})
)






// SHOW ROUTE

router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author"
            },
        })
        .populate("owner")
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!")
        res.redirect("/listings")
    }
    // here we use populate because in reviews he have _id only so we need more information related to that id so we use populate()
    res.render("listings/show.ejs", { listing })
})
)




module.exports = router;