"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const expressNunjucks = require('express-nunjucks').default;
const app = express();
const isDev = app.get('env') === 'development';
const dirname = path.join(__dirname, '../views');
app.set('views', dirname);
expressNunjucks(app, {
    watch: isDev,
    noCache: isDev
});
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use('/', indexRouter);
app.use('/users', usersRouter);
// catch 404 and forward to error handler
app.use(function (_req, _res, next) {
    next(createError(404));
});
// Error handler
app.use(function (err, req, res, _next) {
    // Set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // Render the error page
    res.status(err.status || 500);
    res.render('error');
});
// TODO: Move this default to .env.development
const port = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 5001;
app.listen(port);
