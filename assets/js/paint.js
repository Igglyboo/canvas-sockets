paper.install(window);

window.onload = function () {
    paper.setup('drawingArea');
    var tool = new Tool();
    var brush = document.getElementById("brush");
    var path;
    var points = [];

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

