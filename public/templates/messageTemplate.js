const {0: body} = document.getElementsByTagName('body');

const createMessageTemplate = () => {
    const html = '<script id="message-template" type="text/html"><div class="message" style="background: {{color}}; border: 1px solid {{color}};"><p><span class="message__name">{{username}}</span><span class="message__meta">{{createdAt}}</span></p><div style="height: 7px;"></div><p style="margin-left: 5px;">{{message}}</p><img id="tts" class="tts" width="20px" height="20px" style="float: right; position: relative; left: 35px; bottom: 30px;" aria-label="Text To Speech" title="Text To Speech" src="/img/speak.png"></audio></div></script>';

    body.insertAdjacentHTML('beforeend', html);
};

createMessageTemplate();