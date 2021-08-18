const $sendLocationButton = document.querySelector('#send-location');
const $locationTemplate = document.querySelector('#location-template').innerHTML;

socket.on('locationMessage', ({ username, url, createdAt, color }) => {
    const html = Mustache.render($locationTemplate, {
        username,
        url,
        color,
        createdAt: moment(createdAt).format('HH:mm')
    });

    $messages.insertAdjacentHTML('beforeend', html);

    const lastChild = $messages.lastElementChild;
    const text = lastChild.querySelectorAll('p')[1].textContent;
    let tamText = text.length * 10;
    tamText = tamText < 120 ? 120 : tamText;

    lastChild.style.height = lastChild.clientHeight + 10 + 'px';
    lastChild.style.width = `${tamText}px`;

    autoscroll();
});

$sendLocationButton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser');
    }

    $sendLocationButton.setAttribute('disabled', 'disabled');

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            lat: position.coords.latitude,
            lon: position.coords.longitude
        }, () => {
            $sendLocationButton.removeAttribute('disabled');
        });
    });
});