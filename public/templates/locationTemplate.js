const createLocationTemplate = () => {
    const html = '<script id="location-template" type="text/html"><div class="message" style="background: {{color}}; border: 1px solid {{color}};"><p><span class="message__name">{{username}}</span><span class="message__meta">{{createdAt}}</span></p><p style="margin-left: 5px; margin-bottom: 0px;"><a href="{{url}}" target="_blank">My current Location</a></p></div></script>';

    body.insertAdjacentHTML('beforeend', html);
};

createLocationTemplate();