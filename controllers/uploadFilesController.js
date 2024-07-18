const cloudinary = require('../middlewares/cloudinary');
const cloudinaryCon = require('../middlewares/cloudinaryConf');
const fs = require("fs");

exports.uploadFiles = async (req, res) => {
    try {
        if (req.file) {
            const uploader = async (path) => await cloudinary.uploads(path, 'SpellEng')
            const urls = [];
            const { path } = req.file;
            const newPath = await uploader(path)
            console.log(newPath);
            urls.push(newPath);
            fs.unlinkSync(path);
            res.status(200).json(urls[0])
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
        const uploadResponse = await cloudinary.uploads(`data:${mimeType};base64,${base64Data}`, {
            folder: 'SpellEng',
            resource_type: 'auto'
        });

        console.log(uploadResponse);

        res.status(200).json(uploadResponse);
    } catch (error) {
        console.log(error);
        res.status(400).json({ errorMessage: 'Files could not be uploaded.', error });
    }
}

exports.deleteFile = async (req, res) => {
    try {
        if (req.body.file) {
            let file = req.body.file;
            await cloudinaryCon.uploader.destroy(file.id);
            res.status(200).json({ successMessage: 'File deleted successfully' })
        } else {
            res.status(400).json({ errorMessage: 'File could not be deleted.' });
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ errorMessage: 'Files could not be uploaded.', error });
    }
} 