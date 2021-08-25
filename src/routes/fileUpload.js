const express = require('express');
const sharp = require('sharp');
const upload = require('../utils/multerConfig');
const router = new express.Router();

router.post('/chat.html?', upload.single('upfile'), async (req, res) => {
    try {
        const file = req.file.buffer;
        const mimeType = req.file.mimetype;

        const index = req.file.originalname.lastIndexOf('.');
        const fileName = req.file.originalname.substr(0, index);
        const ext = req.file.originalname.substr(index + 1);
        
        const resizableExt = ['jpg', 'jpeg', 'png'];
       
        if (!resizableExt.includes(ext.toLowerCase())) {
            return res.send({
                file: file.toString('base64'),
                preview: file.toString('base64'),
                mimeType,
                fileName,
                ext
            });
        }

        const buffer = await sharp(file)
            .resize(200, 200, {
                fit: sharp.fit.inside,
                withoutEnlargement: true,
            })
            .png()
            .toBuffer();

        res.send({
            file: file.toString('base64'),
            preview: buffer.toString('base64'),
            mimeType,
            fileName,
            ext
        });
    } catch (e) {
        res.status(500).send(e.message);
    }
}, (error, req, res, next) => {
    res.status(400).send(error.message);
});

module.exports = router;