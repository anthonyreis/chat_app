const fs = require('fs');

const generateFile = async (file, preview, id, fileName, ext) => {
    fs.writeFile(`public/uploadedFiles/${fileName}${id}.${ext}`, file, (error) => {
        if (error) {
            return error.message;
        }
    });

    fs.writeFile(`public/uploadedFiles/${fileName}${id}-preview.${ext}`, preview, (error) => {
        if (error) {
            return error.message;
        }
    });
};

module.exports = generateFile;