const {0: body} = document.getElementsByTagName('body');

const blockDevTools = () => {
    body.onkeydown = function(e) {
        if (e.which == 123) {
            return false;
        }
        if (e.ctrlKey && e.shiftKey && e.which == 'I'.charCodeAt(0)) {
            return false;
        }
        if (e.ctrlKey && e.shiftKey && e.which == 'C'.charCodeAt(0)) {
            return false;
        }
        if (e.ctrlKey && e.shiftKey && e.which == 'J'.charCodeAt(0)) {
            return false;
        }
        if (e.ctrlKey && e.which == 'U'.charCodeAt(0)) {
            return false;
        }
    };
};

blockDevTools();