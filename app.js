const express = require('express');
const mongoose = require('mongoose');
//const dotenv = require('dotenv');

// IMPORT ROUTES
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

// SET APP CONFIGS
dotenv.config();

// START SERVER
const app = express();

// CONNECT TO DB
mongoose.connect(
    process.env.DB_CONNECTION, 
    { useUnifiedTopology: true, useNewUrlParser: true },    
    () => console.log('connected to db')
);

// MIDDLEWARES
app.use(express.json());

// Route Middlewares
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);

app.listen(process.env.PORT, () => console.log(`server listening on port ${process.env.PORT}`));
