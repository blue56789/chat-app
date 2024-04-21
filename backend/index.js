require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const { Server } = require('socket.io');

//middleware
app.use(express.json({ limit: '100mb' }));
app.use(express.static(path.resolve(__dirname, '../frontend', 'dist')))

//routes
app.use('/user', require('./routers/user'));
app.use('/api', require('./routers/api'));

const connect = async () => {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    // console.log(`MongoDB Connected: ${conn.connection.host}`);
}
connect().catch((err) => console.log(err));

const server = app.listen(process.env.PORT, () => {
    console.log('Server listening on port', process.env.PORT);
});

const idMap = new Map();
const userMap = new Map();

const io = new Server(server, {
    maxHttpBufferSize: 1e8,
    pingTimeout: 60000,
    connectionStateRecovery: {},
    cors: { origin: 'http://localhost:5173' }
});
io.on('connection', (socket) => {
    socket.on('setup', (username) => {
        idMap.set(username, socket.id);
        userMap.set(socket.id, username);
    });
    socket.on('subscribe', (users) => {
        users.forEach(u => {
            socket.join(u);
            if (idMap.has(u)) {
                socket.emit('notifyOnline', u);
                // console.log(userMap.get(socket.id), 'asked for', u);
            }
        });
    })
    socket.on('notifyOnline', () => {
        const user = userMap.get(socket.id)
        socket.in(user).emit('notifyOnline', user);
        // console.log(idMap, 'online');
    });
    socket.on('notifyOffline', () => {
        const user = userMap.get(socket.id)
        socket.in(user).emit('notifyOffline', user);
        userMap.delete(socket.id);
        idMap.delete(user);
        // console.log(idMap, 'offline');
    });
    socket.on('newMessage', (msg, convo) => {
        // console.log(`Message ${msg.body}`);
        convo.lastMessage = msg;
        convo.users.forEach(user => {
            socket.to(idMap.get(user)).emit('messageRecieved', msg, convo);
        });
    });
    socket.on('delConvo', (convo) => {
        convo.users.forEach(user => {
            socket.to(idMap.get(user)).emit('convoDeleted', convo._id);
        });
    });
    socket.on('disconnect', () => {
        const user = userMap.get(socket.id);
        socket.in(user).emit('notifyOffline', user);
        userMap.delete(socket.id);
        idMap.delete(user);
    })
});