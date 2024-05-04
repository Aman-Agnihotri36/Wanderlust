var cloudinary = require('cloudinary');
var cloudinaryStorage = require('multer-storage-cloudinary');


// cloudinary.config matlab cloudinary ke account ko backend se jodna
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})


var storage = cloudinaryStorage({
    cloudinary: cloudinary,
    folder: 'Wanderlust_DEV',
    allowedFormats: ['jpg', 'png', "jpeg"],
    
});


module.exports = {
    cloudinary,
    storage
}