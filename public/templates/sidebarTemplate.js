const createSidebarTemplate = () => {
    const html = '<script id="sidebar-template" type="text/html"><h2 class="room-title">{{room}}</h2><p id="videoName" style="opacity: 0.5;">{{videoName}}</p><h3 class="list-title">Users</h3><hr><ul class="users">{{#users}}<li>{{username}}</li>{{/users}}</ul></script>';

    body.insertAdjacentHTML('beforeend', html);
};

createSidebarTemplate();