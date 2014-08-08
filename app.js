var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(8000, "0.0.0.0");

app.use(express.static(__dirname + '/assets'));

app.get('/', function (req, res) {
    res.sendfile('index.html');
});

var user_list = [];

io.on('connection', function (socket) {
    var current_user;

    socket.on('user name', function (user_name) {
        current_user = user_name;
        user_list.push(user_name);
        io.emit('user list', user_list);
        io.emit('new user joined', current_user);
    });

    socket.on('disconnect', function () {
        var index = user_list.indexOf(current_user);
        if (index !== -1) {
            user_list.splice(index, 1);
        }
        io.emit('chat message', current_user + " has disconnected.");
        io.emit('user list', user_list);
    });

    socket.on('chat message', function (msg) {
        io.emit('chat message', current_user + ": " + msg);
    });

    socket.on('path', function (path) {
        socket.broadcast.emit('path', path);
    });

    socket.on('project', function (path) {
        socket.broadcast.emit('project', path);
    });


});