
                //Packages and middlewares declaration for good functioning Express App
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user');

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json({ limit: '5000mb' }))

app.use('/api/auth', userRoutes);

module.exports = app;
