const socket = io();

const $messageForm = document.querySelector('#formMessage');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $sendAudioButton = document.querySelector('#audioFile');
const $messages = document.querySelector('#messages');

const $playTTS = [];
let $videoName = '';
let audioBot = '';
let oldAudio = '';
navigator.getUserMedia = navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia;

const $messageTemplate = document.querySelector('#message-template').innerHTML;
const $sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

const { username, room, password } = Qs.parse(location.search, { ignoreQueryPrefix: true });

socket.on('message', ({ username, message, createdAt, color}) => {
    const html = Mustache.render($messageTemplate, {
        username,
        message,
        color,
        createdAt: moment(createdAt).format('HH:mm')
    });

    $messages.insertAdjacentHTML('beforeend', html);
    
    $playTTS.push($messages.lastElementChild.querySelector('#tts'));
   
    $playTTS[$playTTS.length - 1].addEventListener('click', (e) => {
        for (const item of $playTTS) {
            if (item != e.target) {
                item.style.display = 'none'; 
            }
        }

        setSpeech(message, $playTTS);
    });

    const lastChild = $messages.lastElementChild;
    const ttsButton = $messages.lastElementChild.querySelector('#tts');

    const text = lastChild.querySelectorAll('p')[1].textContent;
    let tamText = text.length * 10;
    tamText = tamText < 120 ? 120 : tamText > 500 ? 500 : tamText;

    lastChild.style.width = `${tamText}px`;
    lastChild.style.wordBreak = 'break-all';
    lastChild.style.height = lastChild.clientHeight - 10 + 'px';
   
    ttsButton.style.bottom = parseInt(lastChild.style.height) / 1.4 + 'px';

    autoscroll();
});

$('#modal')[0].addEventListener('click', () => {
    $('#modal').modal('hide');
    
    audioBot = new Audio();
});

socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render($sidebarTemplate, {
        room: room.charAt(0).toUpperCase() + room.substr(1),
        videoName: $videoName === '' ? '' : $videoName.textContent,
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

    if (message.substr(0, 5) === './bot') {
        $messageFormButton.removeAttribute('disabled');
        $messageFormInput.value = '';
        $messageFormInput.focus();

        socket.emit('botCommand', message);
    } else {
        socket.emit('sendMessage', message, (error) => {
            $messageFormButton.removeAttribute('disabled');
            $messageFormInput.value = '';
            $messageFormInput.focus();

            if (error) {
                console.log('Algo deu errado');
            }
        });
    }
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

socket.on('playVideo', (videoId, videoName) => {
    audioBot = new Audio(`downloadMusic/${videoId}.mp3`);
    $videoName = document.querySelector('#videoName');

    audioBot.addEventListener('ended', () => {
        $videoName.style.display = 'none';
    });
    
    audioBot.addEventListener('playing', () => {
        if (oldAudio !== '') {
            oldAudio.pause();
        }

        oldAudio = audioBot;
    });

    audioBot.play();
    
    $videoName.textContent = 'Reproduzindo: ' + videoName;
    $videoName.style.display = 'initial';
});

socket.on('stopAudio', () => {
    audioBot.pause();
    $videoName.style.display = 'none';

    audioBot = new Audio();
});

window.addEventListener('load', () => {
    setButtonSize();
    $('#modal').modal('show');
    
    setTimeout(() => {
        document.querySelector('#okButton').focus();
    }, 500);
});