const socket = io();

const $messageForm = document.querySelector('#formMessage');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $sendAudioButton = document.querySelector('#audioFile');
const $messages = document.querySelector('#messages');

// Templates
const $messageTemplate = document.querySelector('#message-template').innerHTML;
const $sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

//Options
const { username, room, password } = Qs.parse(location.search, { ignoreQueryPrefix: true });

socket.on('message', ({ username, message, createdAt, color}) => {
    const html = Mustache.render($messageTemplate, {
        username,
        message,
        color,
        createdAt: moment(createdAt).format('HH:mm')
    });

    $messages.insertAdjacentHTML('beforeend', html);

    const $playTTS = document.getElementsByClassName('tts');
   
    $playTTS[$playTTS.length - 1].addEventListener('click', () => {
        for (const item of $playTTS) {
            if (item != $playTTS[$playTTS.length - 1]) {
                item.style.display = 'none'; 
            }
        }

        setSpeech(message, $playTTS);
    });

    const lastChild = $messages.lastElementChild;

    const text = lastChild.querySelectorAll('p')[1].textContent;
    let tamText = text.length * 10;
    tamText = tamText < 120 ? 120 : tamText > 500 ? 500 : tamText;

    lastChild.style.width = `${tamText}px`;
    lastChild.style.wordBreak = 'break-all';
    lastChild.style.height = lastChild.clientHeight + 10 + 'px';

    autoscroll();
});

socket.on('roomData', ({ room, users }) => {
    setButtonSize();
    const html = Mustache.render($sidebarTemplate, {
        room: room.charAt(0).toUpperCase() + room.substr(1),
        users
    });

    document.querySelector('#sidebar').innerHTML = html;

    $sendAudioButton.style.left = '0px';
    $sendAudioButton.style.bottom = '0px';
    $sendAudioButton.style.zIndex = '0';
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