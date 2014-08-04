var user_name = prompt('User Name:');
var canvas = document.getElementById('drawingArea');
var ctx = canvas.getContext('2d');
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