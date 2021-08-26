const $fileTemplate = document.querySelector('#file-template').innerHTML;
const $fileForm = document.querySelector('#fileForm');

socket.on('fileMessage', async ({ mimeType, username, id, fileName, ext, createdAt, color }) => {

    fetchData(fileName, id, ext, async (file, preview) => {

        const dimensions = await getImageDimensions(`${fileName}${id}-preview.${ext}`, ext);

        const html = Mustache.render($fileTemplate, {
            file,
            mimeType,
            preview,
            username,
            fileName,
            ext,
            color,
            createdAt: moment(createdAt).format('HH:mm')
        });
            
        $messages.insertAdjacentHTML('beforeend', html);
            
        const child = $messages.lastElementChild.lastElementChild;
            
        const lastChild = $messages.lastElementChild;

        const {0: img} = lastChild.getElementsByTagName('embed');

        if (ext === 'pdf') {
            child.style.marginLeft = '310px';
            lastChild.style.width = '400px';
            lastChild.style.height = '230px';
        } else if (dimensions.w < 200) {
            img.style.marginLeft = '110px';
        }
    });

    const observer = new MutationObserver(function() {
        setTimeout(function() {
            autoscroll();
            observer.disconnect();
        }, 1000);
    });

    observer.observe($messages, {attributes: false, childList: true, characterData: false, subtree:true});

});

$sendFileButton.addEventListener('mouseover', () => {
    $sendFileContainer.style.backgroundColor = '#7974F4';
});

$sendFileButton.addEventListener('mouseout', () => {
    $sendFileContainer.style.backgroundColor = '#CCCBFB';
});

$sendFileButton.addEventListener('change', () => {
    const url = 'chat.html';
    const formData = new FormData($fileForm);
    formData.append('userId', socket.id);

    $.ajax({
        type: 'POST',
        url,
        data: formData,
        contentType: false,
        cache: false,
        processData: false,
        success(data) {
            const newData = {
                mimeType: data.mimeType,
                fileName: data.fileName,
                ext: data.ext
            };
            socket.emit('sendFile', newData);
        }
    });
});

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