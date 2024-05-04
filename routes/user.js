const express = require("express")
const router = express.Router()
const User = require("../models/Users.js")
const wrapAsync = require("../utils/wrapAsync")
const { route } = require("./listing.js")
const passport = require("passport")
const {saveRedirectUrl} = require("../middleware.js")


// SIGNUP

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs")
})

router.post("/signup", wrapAsync(async (req, res) => {
    try {
        let { username, email, password } = req.body
        const newUser = new User({ email, username })
        const registerUser = await User.register(newUser, password)
        console.log(registerUser);
        req.login(registerUser, (err)=>{
            if(err){
                return next(err)
            }
            req.flash("sucess", "Welcome to Wanderlust")
            res.redirect("/listings")
        })
        
    } catch (e) {
        req.flash("error", e.message)
        res.redirect("/signup")
    }

})
)

// LOGIN
 

router.get("/login", (req, res) => {
    res.render("users/login.ejs")
})

router.post("/login", saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), async (req, res) => {
    // jaise hi is middleware ne sucess message de diya means login ho gaya passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }) to waise hi turant passport req.session ko reset kar deta hai that's why we save req.sessions.redirectUrl in our locals and passport can't excess locals
    req.flash("sucess", "Welcome back to wanderlust")

    let redirectUrl = res.locals.redirectUrl || "/listings"
    console.log(redirectUrl);
    
    // we done this because if we directly try to login so isLoggedIn middleware does not run due to which our res.locals.redirectUlr get uninitialize and it shows undifine and we get the error pagen not found so we set that if res.locals.redirectUrl is  uninitialize than redirect to /listings
    res.redirect(redirectUrl)
})


// LOGOUT

router.get("/logout", (req, res, next) => {

    req.logout((err) => {
        if (err) {
            next(err)
        }

        req.flash("sucess", "you are logged out!")
        res.redirect("/listings")
    })



})


module.exports = router