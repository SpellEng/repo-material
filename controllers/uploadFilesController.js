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

exports.uploadMeetingRecordingToCloudinary = async (req, res) => {
    try {
        const { file } = req.body;

        if (!file) {
            return res.status(400).json({ errorMessage: 'No file uploaded.' });
        }

        // Decode base64 string
        const matches = file.match(/^data:(.*?);base64,(.*)$/);
        if (!matches || matches.length !== 3) {
            return res.status(400).json({ errorMessage: 'Invalid file format.' });
        }

        const mimeType = matches[1];
        const base64Data = matches[2];

        // Upload to Cloudinary
        // const uploadResponse = await cloudinary.uploads(`data:${mimeType};base64,${base64Data}`, {
        //     folder: 'SpellEng',
        //     resource_type: 'auto'
        // });

        let buffer = `data:${mimeType};base64,${base64Data}`;

        const params = {
            Bucket: config.AWS_BUCKET_NAME,
            Key: "recording.mp4", // File name you want to save as in S3
            Body: file,
            ACL: 'public-read' // To make the file publicly accessible
        };

        await s3.upload(params, (err, data) => {
            if (err) {
                throw err;
            }

            let getData = JSON.parse(JSON.stringify(data));
            let sanitizedObject = {
                url: getData?.Location,
                id: getData?.key
            }
            console.log(sanitizedObject);
            // res.status(200).json(sanitizedObject);
        });

        // console.log(uploadResponse);

        // res.status(200).json(uploadResponse);
    } catch (error) {
        console.log(error);
        res.status(400).json({ errorMessage: 'Files could not be uploaded.', error });
    }
}