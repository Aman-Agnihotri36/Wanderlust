const mongoose = require("mongoose")
const { type } = require("../schema")
const Schema = mongoose.Schema

const reviewSchema = new Schema({
    comment: String,
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now() 
        // use to get a current Date
    },

    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
})


const Reviews = mongoose.model("Reviews", reviewSchema)

module.exports = Reviews