const $sendFileContainer = document.querySelector('#fileBtn');
const $sendFileButton = document.querySelector('#upfile');

const setButtonSize = () => {
    const sizes = getComputedStyle($sendFileContainer);

    $sendFileButton.style.cursor = 'pointer';
    $sendFileButton.style.width = sizes.width;
    $sendFileButton.style.height = sizes.height;
    $sendFileButton.style.right = '95px';
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