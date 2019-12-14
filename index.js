var Map = require("collections/map");
var Set = require("collections/set");

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

const clients = new Map();

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

// middleware

io.use((socket, next) => {
    let token = socket.handshake.query.token;
    if (token) {
        return next();
    }
    return next(new Error('authentication error'));
});

io.on('connection', function(socket) {
    let socket_id = socket.conn.id;
    let app_id = socket.handshake.query.id;
    let token = socket.handshake.query.token;
    let secret = socket.handshake.query.secret;

    if (secret) {
        console.log('a server connected');
        socket.on('serverbroadcast', function(msg) {
            if (msg.id) {
                // check if msg.id starts with app_id or is a user within the same app...
                if ((clients.has(token) && clients.get(token).has(msg.id)) || msg.id.toString().startsWith(app_id + '__')) {
                    io.to(msg.id).emit(msg.event, msg.data);
                } else {
                    console.log('ignoring: ' + msg.id)
                }
            } else {
                io.to(app_id).emit(msg.event, msg.data);
            }
        });

    } else {
        console.log('a user connected');
        if (!clients.has(token)) {
            clients.set(token, new Set());
        }

        clients.get(token).add(socket_id);
        socket.join(app_id);
    }

    // io.to(socket_id).emit('chat message', 'Welcome');
    // socket.on('chat message', function(msg){
    //   console.log( msg);
    //   io.emit('chat message', msg.message);
    // });

    socket.on('subscribe', function(room, fn) {
        socket.join(app_id + '__' + room);
        io.to(socket_id).emit('simplesockets:subscription_succeeded', true);
        if(typeof fn === 'function') {
          fn('subscription_succeeded');
        }
    });

    socket.on('unsubscribe', function(room, fn) {
        socket.leave(app_id + '__' + room);
        io.to(socket_id).emit('simplesockets:unsubscription_succeeded', true);
        if(typeof fn === 'function') {
          fn('unsubscription_succeeded');
        }
    });

    socket.on('disconnect', function() {
        console.log('user disconnected');
        if (clients.has(token)) {
            clients.get(token).delete(socket_id);
        }
    });
});

http.listen(3000, function() {
    console.log('listening on *:3000');
});