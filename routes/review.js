const express = require("express")
const router = express.Router({ mergeParams: true })
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const Reviews = require("../models/Reviews.js")
const Listing = require("../models/listing.js")
const { isLoggedIn } = require("../middleware.js")

// Reviews Route

router.post("/", isLoggedIn, wrapAsync(async (req, res) => {
    if (!req.body.review) {
        throw new ExpressError(400, "Send valid data for review")
    }

    let { id } = req.params
    const listing = await Listing.findById(id)
    let newReview = new Reviews(req.body.review)
    console.log(newReview.rating);


    if (!newReview.rating) {
        throw new ExpressError(400, "Rating is missing")
    }
    if (!newReview.comment) {
        throw new ExpressError(400, "Comment is missing")
    }

    newReview.author = req.user._id
    listing.reviews.push(newReview)

    const item = await newReview.save();
    console.log(item);

    await listing.save();

    req.flash("sucess", "New Review Created")

    res.redirect(`/listings/${listing._id}`)

})
)


// DELETE REVIEW ROUTE

router.delete("/:reviewId",  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;

    if (!req.isAuthenticated()) {
        req.flash("error", "Go and login first")
        res.redirect("/login")
    }

    let review = await Reviews.findById(reviewId)
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the author of this review")
        return res.redirect(`/listings/${id}`)
    }

    if (review.author.equals(res.locals.currUser._id)) {
        await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
        await Reviews.findByIdAndDelete(reviewId)
        req.flash("sucess", " Review Deleted")
        res.redirect(`/listings/${id}`)
    }


})
)

module.exports = router