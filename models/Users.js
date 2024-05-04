
const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");



const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    }
})

userSchema.plugin(passportLocalMongoose)
// above line hamare liye username, password, hassing sab ka kaam kar degi

const User = mongoose.model("User", userSchema)

module.exports = User