const mongoose = require("mongoose");
const { type } = require("../schema");
const Reviews = require("./Reviews");
const Schema = mongoose.Schema;


const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        type: String
        
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Reviews"
        }
    ],

    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },

    category:{
        type: String,
        enum: ['Rooms', 'Castles', ' Pools', 'Camping', 'Farms', 'Snow', 'Mountain', 'Doms', 'Boats']
    }
})


listingSchema.post("findOneAndDelete", async(listing) =>{
    if(listing) {
        await Reviews.deleteMany({_id: {$in: listing.reviews}})
    }
})


const Listing = mongoose.model("Listing", listingSchema)

module.exports = Listing