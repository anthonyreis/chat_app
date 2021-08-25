const $chat = document.querySelector('.chat__main');

$chat.addEventListener('dragenter', (e) => {
    e.preventDefault();
    e.dataTransfer.effectAllowed = 'move';

    //e.dataTransfer.setData('image/jpeg', e.target.id);
    //e.dataTransfer.setData('application/x-moz-file', e.dataTransfer.files[0], 0);
    $chat.style.border = '2px dashed #CCCBFB';
});

$chat.addEventListener('dragleave', (e) => {
    e.preventDefault();
    $chat.style.border = 'initial';
});


$chat.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
    $chat.style.border = '2px dashed #CCCBFB';
});

$chat.addEventListener('drop', (e) => {
    e.preventDefault();
    $chat.style.border = 'initial';
    const { 0: file } = e.dataTransfer.files;
    const url = 'chat.html';

    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    xhr.open('POST', url, true);

    xhr.addEventListener('readystatechange', function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            socket.emit('sendFile', JSON.parse(xhr.response));
        } else if (xhr.readyState == 4 && xhr.status != 200) {
            alert(xhr.response);
        }
    });

    formData.append('upfile', file);
    formData.append('userId', socket.id);
    xhr.send(formData);
});