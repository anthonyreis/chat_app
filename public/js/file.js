const $fileTemplate = document.querySelector('#file-template').innerHTML;
const $fileForm = document.querySelector('#fileForm');
let fileData;

socket.on('fileMessage', ({ mimeType, username, fileName, ext, createdAt, color }) => {
    const html = Mustache.render($fileTemplate, {
        file: fileData.file,
        mimeType,
        preview: fileData.preview,
        username,
        fileName,
        ext,
        color,
        createdAt: moment(createdAt).format('HH:mm')
    });
        
    $messages.insertAdjacentHTML('beforeend', html);
        
    const child = $messages.lastElementChild.lastElementChild;
        
    const lastChild = $messages.lastElementChild;
        
    if (ext === 'pdf') {
        child.style.marginLeft = '310px';
        lastChild.style.width = '400px';
        lastChild.style.height = '230px';
    }
        
    autoscroll();

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

    $.ajax({
        type: 'POST',
        url,
        data: formData,
        contentType: false,
        cache: false,
        processData: false,
        success(data) {
            fileData = data;
            const newData = {
                mimeType: data.mimeType,
                fileName: data.fileName,
                ext: data.ext
            };
            socket.emit('sendFile', newData);
        }
    });
});