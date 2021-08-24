const express = require('express');
const sharp = require('sharp');
const upload = require('../utils/multerConfig');
const router = new express.Router();

router.post('/chat.html?', upload.single('upfile'), async (req, res) => {
    try {
        console.log(req);
        const file = req.file.buffer;
        const mimeType = req.file.mimetype;

        const { 0: fileName, 1: ext } = req.file.originalname.split('.');

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