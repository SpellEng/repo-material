const express = require('express');
const { uploadFiles } = require('../controllers/uploadFilesController');
const upload = require('../middlewares/multer');

const router = express.Router();
 
router.post('/upload', upload.single("file"), uploadFiles);

module.exports = router;