var path = require('path');           
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var database = require('./database');
var cors = require('cors')
var apiRouter = require('./routes/api');
const { is_production } = require('big-project-common');

var app = express();

// security hardening: don't tell the client about the backend
app.disable("x-powered-by");

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.json())
app.use(cors());
if (!is_production()) {
    app.options('*', cors());
} else {
    app.options(['group21-big.herokuapp.com', 'timetamer.kurtw.dev'], cors());
}

app.use('/api', apiRouter);

///////////////////////////////////////////////////
// For Heroku deployment

// Server static assets if in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '..', 'frontend', 'big-project-web', 'build')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '..', 'frontend', 'big-project-web', 'build', 'index.html'));
    });
} else {
    // do nothing, because react server will run on it's own
}
module.exports = app;
