const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const PORT = process.env.PORT || 5000;

const app = express();
require('dotenv').config();

app.use(cors())

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true 
}).then(() => console.log('Database connected'))
.catch((err) => console.log('Error', err))


app.get('/', (req, res) => {
    
})



app.listen(PORT, () => console.log('Server running successfully'))