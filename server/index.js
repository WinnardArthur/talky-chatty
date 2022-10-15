const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const PORT = process.env.PORT || 5000;
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');

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
app.use('/api/chat', chatRoutes)

app.use('*', (req, res) => {
    res.json({message: '404: PAGE NOT FOUND'})
})



app.listen(PORT, () => console.log('Server running successfully'))