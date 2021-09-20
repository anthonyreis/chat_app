const blobToBase64 = function(blob) {
    const reader = new FileReader();

    reader.readAsDataURL(blob);

    return new Promise((resolve) => {
        reader.onloadend = () => {
            const dataUrl = reader.result;
            const {1:base64} = dataUrl.split(',');

            resolve(base64);
        };
    });
};

const fetchData = async (fileName, id, ext, callback) => {
    fetch(`uploadedFiles/${fileName}${id}.${ext}`).then(function(response) {
        return response.blob();
    }).then((blob) => {
        blobToBase64(blob).then((b64File) => {
            fetch(`uploadedFiles/${fileName}${id}-preview.${ext}`).then(function(response) {
                response.blob().then((blobPreview) => {
                    blobToBase64(blobPreview).then((b64Preview) => {
                        callback(b64File, b64Preview);
                    });
                });
            });
        });
    });
};

const getImageDimensions = (fileName, ext) => new Promise(function (resolve, rejected) {
    if (ext === 'pdf') {
        resolve(null);
    }

    const i = new Image();

    i.onload = function() {
        resolve({w: i.width, h: i.height});
    };
    
    i.src = `uploadedFiles/${fileName}`;
});