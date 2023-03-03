const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const PORT = process.env.PORT || 5000;
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoute = require('./routes/messageRoutes')

const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
}).then(() => console.log('Database connected'))
.catch((err) => console.log('Error', err))


app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoute)


// Production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, "client/build")))

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, "client", "build", "index.html"))
    })
} else {
    app.get("/", (req, res) => {
        res.send("API running successfully...")
    })
}


const server = app.listen(PORT, () => console.log('Server running successfully'))

const io = require('socket.io')(server, {
    cors: {
        origin: process.env.NODE_ENV === 'production' ? process.env.CONNECTION_URL : 'http://localhost:3000'
    },
    pingTimeout: 60000
})

io.on("connection", (socket) => {
    socket.on('setup', (userData) => {
        socket.join(userData._id); 
        socket.emit("connected");
    });

    socket.on("join chat", (room) => {
        socket.join(room)
    })

    socket.on("new message", (newMessageReceived, room) => {
        
        var chat = newMessageReceived.chat;
        
        if(!chat.users) return console.log("chat.users not defined");

        chat.users.forEach(user => {
            socket.in(room).emit("message received", newMessageReceived);
        })
    })

    socket.on("typing", (room) => socket.to(room).emit("typing"));
    socket.on("stop typing", (room) => socket.to(room).emit("stop typing"))
})  
