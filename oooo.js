const mongoose = require("mongoose");
const initData = require("./init/data1.js")
const Listing = require("./models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wander"


main().then(()=>{
    console.log('Connected to DB');
    
}).catch((err)=>{
    console.log(err);
    
})

async function main() {
    await mongoose.connect(MONGO_URL)
}



const initDB = async () =>{
    await Listing.deleteMany({});
    await Listing.insertMany(initData)
    console.log('Data was initalise');
    
}

initDB();