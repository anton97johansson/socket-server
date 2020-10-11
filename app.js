const express = require('express');
const app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server);
io.origins(['https://antonscript.me:443']);

io.on('connection', function (socket) {
    var time = new Date().toLocaleString();
    console.info("User connected");
    io.emit('chat message', `[${time}] User connected`);

    socket.on('chat message', function (message) {
        message["time"] = new Date().toLocaleString();
        io.emit('chat message', `[${message["time"]}] ${message["nick"]}: ${message["msg"]}`);
        console.info(message);
    });
});

server.listen(8300);