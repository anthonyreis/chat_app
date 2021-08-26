let previousUtter = '';
const synth = window.speechSynthesis;

const setSpeech = (message, $playTTS) => {
    const voices = synth.getVoices();
    
    const utterThis = new SpeechSynthesisUtterance(message);

    [utterThis.voice] = voices;

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