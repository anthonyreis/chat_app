const socket = io();
const synth = window.speechSynthesis;

const $messageForm = document.querySelector('#formMessage');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $sendFileContainer = document.querySelector('#fileBtn');
const $sendFileButton = document.querySelector('#upfile');
const $sendAudioButton = document.querySelector('#audioFile');
const $messages = document.querySelector('#messages');
let previousUtter = '';

// Templates
const $messageTemplate = document.querySelector('#message-template').innerHTML;
const $sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

//Options
const { username, room, password } = Qs.parse(location.search, { ignoreQueryPrefix: true });

const setSpeech = (message, $playTTS) => {
    const voices = synth.getVoices();
    
    const utterThis = new SpeechSynthesisUtterance(message);
    // eslint-disable-next-line prefer-destructuring
    utterThis.voice = voices[0];

    if (previousUtter != '' && utterThis.text !== previousUtter.text) {
        synth.cancel();
        synth.speak(utterThis);
    } else if (synth.paused) {
        synth.resume();
    } else if (synth.speaking) {
        synth.pause();
    } else {
        synth.speak(utterThis);
    }
   
    previousUtter = utterThis;

    utterThis.addEventListener('end', () => {
        for (const item of $playTTS) {
            item.style.display = 'initial'; 
        }
    });

    utterThis.addEventListener('pause', () => {
        setTimeout(function() {
            for (const item of $playTTS) {
                item.style.display = 'initial'; 
            }
        }, 2000);
    });
};

const setButtonSize = () => {
    const sizes = getComputedStyle($sendFileContainer);

    $sendFileButton.style.width = sizes.width;
    $sendFileButton.style.height = sizes.height;
    $sendFileButton.style.right = '93px';
    $sendFileButton.style.bottom = '25px';
    $sendFileButton.style.padding = sizes.padding;
    $sendFileButton.style.fontSize = sizes.fontSize;
    $sendFileButton.style.lineHeight = sizes.lineHeight;
    $sendFileButton.style.boxSizing = sizes.boxSizing;


    $sendAudioButton.style.width = sizes.width;
    $sendAudioButton.style.height = sizes.height;
    $sendAudioButton.style.right = '35px';
    $sendAudioButton.style.bottom = '24px';
    $sendAudioButton.style.padding = sizes.padding;
    $sendAudioButton.style.fontSize = sizes.fontSize;
    $sendAudioButton.style.lineHeight = sizes.lineHeight;
    $sendAudioButton.style.boxSizing = sizes.boxSizing;
    $sendAudioButton.style.marginLeft = 0;

};

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