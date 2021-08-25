const multer = require('multer');

const upload = multer({
    limits: {
        fileSize: 5000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.toLowerCase().match(/\.(jpg|jpeg|png|pdf)$/)) {
            cb(new Error('Please upload an image (jpg, jpeg, png or pdf)'));
        }

        cb(undefined, true);
    }
});

module.exports = upload;