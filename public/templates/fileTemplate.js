const createFileTemplate = () => {
    const html = '<script id="file-template" type="text/html"><div class="message file-template" style="background: {{color}}; border: 1px solid {{color}};"><p><span class="message__name">{{username}}</span><span class="message__meta">{{createdAt}}</span></p><div style="height: 7px;"></div><p><embed src="data:{{mimeType}};base64,{{preview}}" /></p><span id="file__download"><a id="{{fileName}}" href="data:{{mimeType}};base64,{{file}}" download="{{fileName}}.{{ext}}"><img src="/img/download.png" width="25px" height="25px" style="margin-top: 0; padding: 0;"></a></span></div></script>';

    body.insertAdjacentHTML('beforeend', html);
};

createFileTemplate();