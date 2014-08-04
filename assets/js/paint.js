var user_name = prompt('User Name:');
if (user_name === null) {
    user_name = "User " + 100000 * Math.random().toPrecision(5);
}

var socket = io();

socket.emit('user name', user_name);

$('#chatButton').click(function () {
    var msgSelector = $('#chatInput');
    var msg = msgSelector.val().trim();
    if (msg !== "") {
        socket.emit('chat message', msg);
    }
    msgSelector.val('');
    return false;
});

socket.on('chat message', function (msg) {
    if ($.trim(msg) !== "") {
        $('#chatDisplay').append($('<li></li>').text($.trim(msg)));
    }

});

socket.on('user list', function (msg) {
    var userList = $("#users");
    userList.empty();
    for (var i = 0; i < msg.length; i++) {
        if ($.trim(msg[i]) !== "") {
            userList.append($("<li></li>").text($.trim(msg[i])))
        }
    }
});

paper.install(window);
window.onload = function () {
    paper.setup('drawingArea');
    var tool = new Tool();
    var brush = document.getElementById("brush");
    var path;

    tool.onMouseDown = function (event) {
        path = new Path();
        path.strokeColor = brush.value;
        path.add(event.point);
    };

    tool.onMouseDrag = function (event) {
        path.add(event.point);
    };

    tool.onMouseUp = function (event) {
        socket.emit('path', path.exportJSON({ asString: true, precision: 1 }))
    };

    socket.on('path', function (path_json) {
        socketPath = new Path();
        socketPath.importJSON(path_json);
        view.draw();
    });

    socket.on('project', function (project_json) {
        project.importJSON(project_json);
    });

    socket.on('new user joined', function (new_user) {
        $('#chatDisplay').append($('<li></li>').text($.trim(new_user + " has connected.")));
        socket.emit('project', project.exportJSON({ asString: true, precision: 1 }));
    })
};

