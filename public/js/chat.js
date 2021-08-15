const socket = io();

const $messageForm = document.querySelector('#formMessage');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $sendLocationButton = document.querySelector('#send-location');
const $sendFileContainer = document.querySelector('#fileBtn');
const $sendFileButton = document.querySelector('#upfile');
const $fileForm = document.querySelector('#fileForm');
const $messages = document.querySelector('#messages');

// Templates
const $messageTemplate = document.querySelector('#message-template').innerHTML;
const $locationTemplate = document.querySelector('#location-template').innerHTML;
const $sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;
const $fileTemplate = document.querySelector('#file-template').innerHTML;

//Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

const setButtonSize = () => {
    const sizes = getComputedStyle($sendFileContainer);

    $sendFileButton.style.width = sizes.width;
    $sendFileButton.style.height = sizes.height;
    $sendFileButton.style.right = '24px';
    $sendFileButton.style.bottom = '24px';
    $sendFileButton.style.padding = sizes.padding;
    $sendFileButton.style.fontSize = sizes.fontSize;
    $sendFileButton.style.lineHeight = sizes.lineHeight;
    $sendFileButton.style.boxSizing = sizes.boxSizing;

};

const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild;

    // Get the height of the new message
    const newMessageStyles = getComputedStyle($newMessage);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

    // Visible height
    const visibleHeight = $messages.offsetHeight;

    // Height of messages container
    const containerHeight = $messages.scrollHeight;

    // How far have i scrolled
    const scrollOffset = $messages.scrollTop + visibleHeight;

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight;
    }
};

socket.on('message', ({ username, message, createdAt, color }) => {
    const html = Mustache.render($messageTemplate, {
        username,
        message,
        color,
        createdAt: moment(createdAt).format('HH:mm')
    });
    $messages.insertAdjacentHTML('beforeend', html);

    const lastChild = $messages.lastElementChild;

    const text = lastChild.querySelectorAll('p')[1].textContent;
    let tamText = text.length * 10;
    tamText = tamText < 120 ? 120 : tamText;

    lastChild.style.height = lastChild.clientHeight + 10 + 'px';
    lastChild.style.width = `${tamText}px`;

    autoscroll();
});

socket.on('locationMessage', ({ username, url, createdAt, color }) => {
    const html = Mustache.render($locationTemplate, {
        username,
        url,
        color,
        createdAt: moment(createdAt).format('HH:mm')
    });
    $messages.insertAdjacentHTML('beforeend', html);

    const lastChild = $messages.lastElementChild;
    const text = lastChild.querySelectorAll('p')[1].textContent;
    let tamText = text.length * 10;
    tamText = tamText < 120 ? 120 : tamText;

    lastChild.style.height = lastChild.clientHeight + 10 + 'px';
    lastChild.style.width = `${tamText}px`;

    autoscroll();
});

socket.on('fileMessage', ({ file, mimeType, preview, username, fileName, ext, createdAt, color }) => {
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

    if (ext === 'pdf') {
        child.style.marginLeft = '310px';
        lastChild.style.width = '400px';
        lastChild.style.height = '230px';
    }

    autoscroll();
});

socket.on('roomData', ({ room, users }) => {
    setButtonSize();
    const html = Mustache.render($sidebarTemplate, {
        room: room.charAt(0).toUpperCase() + room.substr(1),
        users
    });

    document.querySelector('#sidebar').innerHTML = html;
});

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault();

    $messageFormButton.setAttribute('disabled', 'disabled');

    const message = e.target.elements.message.value;

    socket.emit('sendMessage', message, (error) => {
        $messageFormButton.removeAttribute('disabled');
        $messageFormInput.value = '';
        $messageFormInput.focus();

        if (error) {
            return alert(error);
        }
    });
});

$sendLocationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser');
    }

    $sendLocationButton.setAttribute('disabled', 'disabled');

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            lat: position.coords.latitude,
            lon: position.coords.longitude
        }, () => {
            $sendLocationButton.removeAttribute('disabled');
        });
    });
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
            socket.emit('sendFile', data);
        }
    });
});

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error);
        location.href = '/';
    }
});