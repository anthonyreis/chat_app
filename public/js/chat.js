const socket = io();

const $messageForm = document.querySelector('#formMessage');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $sendFileContainer = document.querySelector('#fileBtn');
const $sendFileButton = document.querySelector('#upfile');
const $messages = document.querySelector('#messages');


// Templates
const $messageTemplate = document.querySelector('#message-template').innerHTML;
const $sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

//Options
const { username, room, password } = Qs.parse(location.search, { ignoreQueryPrefix: true });

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

socket.emit('join', { username, room, password }, ({ msg, error }) => {
    if (msg) {
        alert(msg);
        socket.emit('join', { username, room }, () => { });
    }

    if (error) {
        alert(error);
        location.href = '/';
    }
});