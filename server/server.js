const path = require('path');
const express = require('express');
var app = express();
const socketIO = require('socket.io', { rememberTransport: false, transports: ['WebSocket', 'Flash Socket', 'AJAX long-polling'] });
var generateMessage = require('./utils/message');
var isRealString = require('./utils/validation.js')
var Users = require('./utils/users.js');
var Bot = require('./utils/bot.js');

const port = process.env.PORT || 3000;
var server = app.listen(port, () => {
    console.log(`server listening at ${port}`);
});
var io = socketIO(server);
var users = new Users();
app.use(express.static(path.join(__dirname, '../public')));


io.on('connection', (socket) => {
    console.log("new user connected");

    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)){
           return callback('there is an error!');
        }
        socket.join(params.room);
        // socket.leave(params.room) -> to leave a room

        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);

        // io.to(params.room).emit -> emits it to everyone
        // socket.broadcast.to(params.room).emit -> emits to everyone except the sender
        // socket.emit() -> emits it to sender
        io.to(params.room).emit('userUpdate', users.getUserList(params.room));
        socket.emit('newMsg', generateMessage('Admin','welcome to the chat'));
        socket.broadcast.to(params.room).emit('newMsg', generateMessage('Admin',`${params.name} joined`)); 
        callback();
    });

    socket.on('disconnect', () => {
        console.log("disconnected");
        var user = users.removeUser(socket.id);
        if (user){
            io.to(user.room).emit('newMsg', generateMessage('Admin', `${user.name} has left the room.`));
            io.to(user.room).emit('userUpdate', users.getUserList(user.room));
        }
    });

    socket.on('createMsg', (data, callback) => {
    //    console.log(data);
        var user = users.getUser(socket.id);
        if (user && isRealString(data.text)){
            io.to(user.room).emit('newMsg', generateMessage(user.name, data.text));
            tweetIt(user.room);
            callback('from the server');
        }
        
    });

    function tweetIt (room){
      //  var user = users.getUser(socket.id);
      //  console.log(user);
        Bot(room,function(tweet){
            console.log("from server:" + tweet);
            socket.emit('newMsg', generateMessage('Twit-Bot', tweet));
        });
        
    }
    
    
});


