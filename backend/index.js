require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const { Server } = require('socket.io');

//middleware
app.use(express.json({ limit: '16mb' }));
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

const io = new Server(server, {
    pingTimeout: 60000,
    cors: { origin: 'http://localhost:5173' }
});
io.on('connection', (socket) => {
    socket.on('setup', (username) => {
        // console.log(`Setup ${username}`);
        socket.join(username);
    });
    socket.on('newMessage', (msg, convo) => {
        // console.log(`Message ${msg.body}`);
        convo.lastMessage = msg;
        convo.users.forEach(user => {
            socket.in(user).emit('messageRecieved', msg, convo);
        });
    });
    socket.on('delConvo', (convo) => {
        convo.users.forEach(user => {
            socket.in(user).emit('convoDeleted', convo._id);
        });
    });
});