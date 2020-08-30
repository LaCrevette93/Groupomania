
                //Packages and middlewares declaration for good functioning Express App
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user');
const forumRoutes = require('./routes/forum');
const commentRoutes = require('./routes/comment');
const path = require('path');

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json({ limit: '5000mb' }))

app.use('/api/auth', userRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/comment', commentRoutes);
app.use('/medias', express.static(path.join(__dirname, 'medias')));

module.exports = app;
