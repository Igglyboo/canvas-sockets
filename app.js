var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendfile('index.html');
});

io.on('connection', function(socket){
    var current_user;

    socket.on('user name', function(user_name){
        current_user = user_name;
        io.emit('chat message', current_user + " has connected.");
    });

    socket.on('disconnect', function(){
        io.emit('chat message', current_user + " has disconnected.");
    });

    socket.on('chat message', function(msg){
        io.emit('chat message', current_user + ": " + msg);
    });
});

http.listen(8000, "0.0.0.0");