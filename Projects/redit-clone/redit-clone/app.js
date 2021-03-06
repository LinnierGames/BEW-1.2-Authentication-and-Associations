const dotenv = require('dotenv');
dotenv.config();

const createError = require('http-errors');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const expressValidator = require('express-validator');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');
const authRouter = require('./routes/auth');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressValidator());
app.use(express.static(path.join(__dirname, 'public')));

// auth middleware
var checkAuth = (req, res, next) => {
  if (typeof req.cookies.nToken === "undefined" || req.cookies.nToken === null) {
    req.currentUser = null;
  } else {
    var token = req.cookies.nToken;
    var decodedToken = jwt.decode(token, { complete: true }) || {};
    req.currentUser = decodedToken.payload;
    res.locals.currentUser = decodedToken.payload
  }

  next();
};
app.use(checkAuth);

var localz = (req, res, next) => {

  // current url
  res.locals.currentUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  res.locals.redirect = req.query.redirect;

  next()
}
app.use(localz);

app.use('/', indexRouter);
app.use('/', authRouter);
app.use('/', usersRouter);
app.use('/posts', postsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

//database setup
const mongoUri = process.env.MONGODB_URI;
mongoose.connect( mongoUri, { useNewUrlParser: true });
mongoose.set('debug', true);

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
