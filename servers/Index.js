const express = require('express');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const headerParser = require("header-parser");
const helmet = require("helmet");
const cors = require("cors");
const passport = require('passport');
const morgan = require('morgan');
const path = require('path');
require('../services/Passport');

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const server = express();

server.use(express.static(path.join(__dirname, '../public/images/'), {
    setHeaders: (res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
    }
}));

server.use(bodyParser.json());
server.use(express.json());
server.use(express.urlencoded({
    extended: true
}));
server.use(morgan('tiny'));
server.use(cookieParser());
server.use(helmet());
server.use(cors());
server.use(headerParser);
server.use(passport.initialize());

server.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
});

const IndexRouter = require("../routes/IndexRoute");
const UserRouter = require("../routes/UserRoute");
const ScheduleRouter = require("../routes/ScheduleRoute");
const BookingRouter = require("../routes/BookingRoute");
server.use(IndexRouter);
server.use(UserRouter);
server.use(ScheduleRouter);
server.use(BookingRouter);

server.use((req, res, next) => {
    next(createError(404));
});

server.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.json({ message: res.locals.message });

    next();
});

module.exports = server;