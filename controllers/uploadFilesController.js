const config = require('../config/keys');
const fs = require("fs");
const AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: config.AWS_ACCESS_KEY,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
    region: config.AWS_REGION
});

const s3 = new AWS.S3();

exports.uploadFiles = async (req, res) => {
    try {
        if (req.file) {
            const { path } = req.file;
            const fileContent = fs.readFileSync(path);
            const params = {
                Bucket: config.AWS_BUCKET_NAME,
                Key: req.file?.filename, // File name you want to save as in S3
                Body: fileContent,
                ACL: 'public-read' // To make the file publicly accessible
            };

            await s3.upload(params, (err, data) => {
                if (err) {
                    throw err;
                }

                let getData = JSON.parse(JSON.stringify(data));
                let sanitizedObject = {
                    url: getData?.Location,
                    id: getData?.key,
                    type: req.file?.mimetype,
                    name: req.file.originalname
                }
                fs.unlinkSync(path);
                res.status(200).json(sanitizedObject);
            });
        } else {
            res.status(400).json({ errorMessage: 'Files could not be uploaded.' });
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ errorMessage: 'Files could not be uploaded.', error });
    }
}