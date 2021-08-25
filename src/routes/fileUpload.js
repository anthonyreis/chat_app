const express = require('express');
const sharp = require('sharp');
const upload = require('../utils/multerConfig');
const router = new express.Router();
const generateFile = require('../utils/generateBase64File');

router.post('/chat.html?', upload.single('upfile'), async (req, res) => {
    try {
        const id = req.body.userId;
        
        const file = req.file.buffer;
        const mimeType = req.file.mimetype;

        const index = req.file.originalname.lastIndexOf('.');
        const fileName = req.file.originalname.substr(0, index);
        const ext = req.file.originalname.substr(index + 1);
        
        const resizableExt = ['jpg', 'jpeg', 'png'];
       
        if (!resizableExt.includes(ext.toLowerCase())) {
            console.log('Não pode dominuir');
            const toSend = {
                mimeType,
                fileName,
                ext
            };

            await generateFile(file, file, id, fileName, ext);

            return res.send(toSend);
        }

        const buffer = await sharp(file)
            .resize(200, 200, {
                fit: sharp.fit.inside,
                withoutEnlargement: true,
            })
            .png()
            .toBuffer();
        

        const toSend = {
            mimeType,
            fileName,
            ext
        };

        await generateFile(file, buffer, id, fileName, ext);

        res.send(toSend);
    } catch (e) {
        res.status(500).send(e.message);
    }
}, (error, req, res, next) => {
    res.status(400).send(error.message);
});

/*router.get('/file.html/:id/:fileName', async (req, res) => {
    const {id, fileName} = req.params;

    const files = [
        new Promise((resolve, reject) => {
            fs.readFile(`src/public/uploadedFiles/${fileName}${id}.txt`, (error, result) => {
                if (error) {
                    reject(error.message);
                }

                resolve(result);
            });
        }),

        new Promise((resolve, reject) => {
            fs.readFile(`src/public/uploadedFiles/${fileName}${id}-preview.txt`, (error, result) => {
                if (error) {
                    reject(error.message);
                }

                resolve(result);
            });
        })
    ];

    await Promise.all(files).then((result) => {
        console.log('Eviou tudo');
        return 'ok';
    });
});*/

module.exports = router;