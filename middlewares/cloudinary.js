const cloudinary = require('cloudinary');
const config = require('../config/keys');

cloudinary.config({
    cloud_name: config.CLOUDINARY_CLOUD_NAME,
    api_key: config.CLOUDINARY_API_KEY,
    api_secret: config.CLOUDINARY_SECRET_KEY
});

exports.uploads = (file, folder) => {
    return new Promise(resolve => {
        cloudinary.uploader.upload(file, (result) => {
            console.log(result);
            resolve({
                url: result?.secure_url,
                id: result?.public_id,
                type: result?.resource_type,
                name: result?.original_filename,
                format: result?.format
            })
        }, {
            resource_type: "auto",
            folder
        })
    })
}