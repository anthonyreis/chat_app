const createAudioTemplate = () => {
    const html = '<script id="audio-template" type="text/html"><div class="message audio audio-template" style="background: {{color}}; border: 1px solid {{color}};"><p><span class="message__name">{{username}}</span><span class="message__meta">{{createdAt}}</span></p><div style="height: 7px;"></div><audio controls src="data:{{mimeType}};base64,{{file}}" style="margin-left: 5px;"></audio><img id="c-{{textId}}" class="stt" width="20px" height="20px" style="float: right; position: relative; left: 35px; top: 7px;" aria-label="Transcribe audio" title="Transcribe audio" src="/img/read.png"><p id="{{textId}}" class="audioText" style="float: right; position: relative; left: 350px; bottom: 35px; display: none; z-index: 2; line-height: 0;">{{audioText}}</p></div></script>';

    body.insertAdjacentHTML('beforeend', html);
};

createAudioTemplate();