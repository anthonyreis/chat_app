const socket = io();

const $messageForm = document.querySelector('#formMessage');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $sendAudioButton = document.querySelector('#audioFile');
const $messages = document.querySelector('#messages');
const $player = document.querySelector('#youtube');
let audioBot = '';
let oldAudio = '';
navigator.getUserMedia = navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia;

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
   
    const $allowAudio = document.querySelector('#allowAudio');

    $allowAudio.addEventListener('click', () => {
        audioBot = new Audio();
        $allowAudio.style.display = 'none';
    });
   
    
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

    $player.addEventListener('onended', () => {
        console.log('Terminou de executar');
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

socket.on('playVideo', (videoId) => {
    audioBot = new Audio(`downloadMusic/${videoId}.mp3`);
    
    audioBot.addEventListener('playing', () => {
        if (oldAudio !== '' && oldAudio.src !== audioBot.src) {
            oldAudio.pause();
        }

        oldAudio = audioBot;
    });

    audioBot.play();
    
    
    /*const firstAudio = new Audio(`downloadMusic/${videoId}.mp3`);
    firstAudio.play();
    
    fetch(`downloadMusic/${videoId}.mp3`).then(function(response) {
        return response.blob();
    }).then((blob) => {
        blobToBase64(blob).then((b64File) => {
            alert('We need permision to play the sound');
            $playAudio.src = `data:audio/mp3;base64,${b64File}`;
        
            //$playAudio.play();
        });
    });*/

    /*if (typeof navigator.mediaDevices === 'undefined' || !navigator.mediaDevices.getUserMedia) {
        alert('This browser does not supports WebRTC getUserMedia API.');

        if (navigator.getUserMedia) {
            alert('This browser seems supporting deprecated getUserMedia API.');
        }
    }

    navigator.mediaDevices.getUserMedia({
        audio: true,
    }).then((result) => {
        $messageFormButton.removeAttribute('disabled');
        $messageFormInput.value = '';
        $messageFormInput.focus();

        $player.src = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=1`;
    });*/
});