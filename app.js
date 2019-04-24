var express = require('express');
var path = require('path');

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var hbs = require('hbs');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var index = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(cookieParser());
app.use(session({
    secret: 'secret',
    name: 'session_id',
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 30
    },
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
        url: 'mongodb://127.0.0.1:27017/login'
    })
}));

app.use(express.static(path.join(__dirname, 'public')));

// res.locals is an object passed to hbs engine
app.use(function (req, res, next) {
    res.locals.session = req.session;
    next();
});

app.use('/', index);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

app.listen(8080, () => {
    console.log('Server is up on the port 8080');
});

module.exports = app;