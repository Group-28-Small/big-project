const path = require('path');           
const PORT = process.env.PORT || 5000;
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.set('port', (process.env.PORT || 5000));

// app.use('/', indexRouter);
app.use('/users', usersRouter);
// app.set('view engine', 'html');
// TODO: wrap this block in a PROD check
app.listen(PORT, () => 
{
  console.log(`Server listening on port ${PORT}.`);
});

///////////////////////////////////////////////////
// For Heroku deployment

// Server static assets if in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '..', 'frontend', 'big-project-web', 'build')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '..', 'frontend', 'big-project-web', 'build', 'index.html'));
    });
}
module.exports = app;
