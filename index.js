if(process.env.NODE_ENV!="production"){
    require('dotenv').config()
}



const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const Listing = require("./models/listing.js")
const path = require("path")
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate")
// It helps to create layout ex- navbar website har ek page mai same rahta hai to use hame baar baar nhi banana padega ham ejs-mate ka use kar sakte hai
// const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js")
// const { listingSchema } = require("./schema.js")
const Reviews = require("./models/Reviews.js")
const Listing = require("./models/listing.js")
const session = require("express-session")
const MongoStore = require("connect-mongo")
const flash = require("connect-flash")
const passport = require("passport")
const LocalStrategy = require("passport-local")
const User = require("./models/Users.js")

const listingsRouter = require("./routes/listing.js")
const reviewsRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js")
const punycode = require('punycode/');



const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"
const dburl = process.env.ATLASOB_URL;

async function main() {
    await mongoose.connect(MONGO_URL)
}

main().then(() => {
    console.log('Connected to DB');

}).catch((err) => {
    console.log(err);

})

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"))
app.engine("ejs", ejsMate)
app.use(express.static(path.join(__dirname, "/public")))


// const store = MongoStore.create({
//     mongoUrl: dburl,
//     crypto: {
//         secret: "mysupersecretcode"
//     },
//     touchAfter: 24 * 3600,
// })

// store.on("error", ()=>{
//     console.log('ERROR in MONGO SESSION STORE');
    
// })
// above code will run if any error  occur in mongo store.

const sessionOptions = {
    
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}




app.use(session(sessionOptions))

// ham flash ko session ke baad use karte hai because flash needs sesssion
app.use(flash());

// we need session for implementation of passport so we use paasport after session
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())



app.use((req, res, next)=>{
    res.locals.sucess = req.flash("sucess")
    res.locals.error = req.flash("error")
    res.locals.currUser = req.user
    console.log(req.user);
    
    next()
})


app.get("/", async(req, res) => {
    const allListings = await Listing.find({})
    res.render("listings/index.ejs", { allListings })

})

app.use("/listings", listingsRouter)
app.use("/listings/:id/reviews", reviewsRouter)
app.use("/", userRouter)

// app.get("/demouser", async(req, res) =>{
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "Bhaiya"
//     })

//     let registeration = await User.register(fakeUser, "CrimeMaster")
//     res.send(registeration)
// })

// app.get("/testListing", async (req, res) =>{
//     let sampleListing = new Listing({
//         title: "My new Vila",
//         description: "By the beach",
//         price: 1200,
//         location: "Calangute, Goa",
//         country: "India",
//     })

//     await sampleListing.save();

//     res.send("sucessful testing")
// })

app.all("*", (req, res, next) => {
    throw new ExpressError(404, "Page not found")
})

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err
    res.render("error.ejs", { err })
    // res.status(statusCode).send(message)
})

app.listen(8080, () => {
    console.log('server is running at port 8080');

})