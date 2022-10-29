const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const PORT = process.env.PORT || 5000;
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoute = require('./routes/messageRoutes')

const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true 
}).then(() => console.log('Database connected'))
.catch((err) => console.log('Error', err))


app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoute)

app.use('*', (req, res) => {
    res.json({message: '404: PAGE NOT FOUND'})
})



const server = app.listen(PORT, () => console.log('Server running successfully'))

const io = require('socket.io')(server, {
    cors: {
        origin: 'http://localhost:3000'
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
            // if(user._id == newMessageReceived.sender._id) return;