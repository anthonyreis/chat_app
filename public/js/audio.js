const $audioTemplate = document.querySelector('#audio-template').innerHTML;
const $sendAudioContainer = document.querySelector('#audioBtn');
const audio = document.querySelector('audio');
let clicked = false;
let recorder = '';
let microphone = '';

const changeColorOver = () => {
    $sendAudioContainer.style.backgroundColor = '#7974F4';
};

const changeColorOut = () => {
    $sendAudioContainer.style.backgroundColor = '#CCCBFB';
};

$sendAudioContainer.addEventListener('mouseover', changeColorOver);

$sendAudioContainer.addEventListener('mouseout', changeColorOut);

socket.on('audioMessage', ({ username, file, fileName, mimeType, ext, audioText, createdAt, fileId, color}) => {
    const html = Mustache.render($audioTemplate, {
        file,
        mimeType,
        username,
        fileName,
        ext,
        color,
        audioText,
        fileId,
        createdAt: moment(createdAt).format('HH:mm')
    });

    $messages.insertAdjacentHTML('beforeend', html);

    const $audioTextButton = document.querySelector(`[id='c-${fileId}']`);

    const $audioText = document.querySelector(`[id='${fileId}']`);

    $audioTextButton.addEventListener('click', () => {
        if ($audioText.style.display === 'none') {
            $audioText.style.display = 'initial';
        } else {
            $audioText.style.display = 'none';
        }
        
    });

    autoscroll();
});

const captureMicrophone = function(callback) {
    if (microphone) {
        callback(microphone);
        return;
    }

    if (typeof navigator.mediaDevices === 'undefined' || !navigator.mediaDevices.getUserMedia) {
        alert('This browser does not supports WebRTC getUserMedia API.');

        if (navigator.getUserMedia) {
            alert('This browser seems supporting deprecated getUserMedia API.');
        }
    }

    navigator.mediaDevices.getUserMedia({
        audio: isEdge ? true : {
            echoCancellation: false
        }
    }).then(function(mic) {
        callback(mic);
    }).catch(function() {
        alert('Unable to capture your microphone. Please check console logs.');
    });
};

$sendAudioContainer.addEventListener('click', () => {
    if (clicked) {
        $sendAudioContainer.addEventListener('mouseover', changeColorOver);
        $sendAudioContainer.addEventListener('mouseout', changeColorOut);
        
        clicked = false;
    
        recorder.stopRecording(stopRecordingCallback);

        return; 
    } 

    $sendAudioContainer.removeEventListener('mouseout', changeColorOut);

    $sendAudioContainer.removeEventListener('mouseover', changeColorOver);

    $sendAudioContainer.style.backgroundColor = '#7974F4';
    
    if (!microphone) {
        captureMicrophone(function(mic) {
            microphone = mic;

            $('#audioBtn').trigger('click');
        });
        return;
    }

    audio.muted = true;
    audio.srcObject = microphone;

    const options = {
        type: 'audio',
        numberOfAudioChannels: isEdge ? 1 : 2,
        checkForInactiveTracks: true,
        bufferSize: 16384
    };

    if (isSafari || isEdge) {
        options.recorderType = StereoAudioRecorder;
    }

    if (navigator.platform && navigator.platform.toString().toLowerCase().indexOf('win') === -1) {
        options.sampleRate = 48000; 
    }

    if (isSafari) {
        options.sampleRate = 44100;
        options.bufferSize = 4096;
        options.numberOfAudioChannels = 2;
    }

    if (recorder) {
        recorder.destroy();
        recorder = null;
    }

    recorder = RecordRTC(microphone, options);

    recorder.startRecording();

    $sendAudioContainer.disabled = false;
    clicked = true;
});

const stopRecordingCallback = function() {
    const audioBlob = recorder.getBlob();
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(audioBlob);

    fileReader.onloadend = () => {
        const arrayBuffer = fileReader.result;
        socket.emit('audioFile', arrayBuffer);
    };
    
    $sendAudioContainer.disabled = false;

    setTimeout(function() {
        if (!audio.paused) {
            return; 
        }

        setTimeout(function() {
            if (!audio.paused) {
                return; 
            }
            audio.play();
        }, 1000);
        
        audio.play();
    }, 300);

    audio.play();
};