const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');

const sessionOptions = session({
    secret: 'SherlockHolmes',
    store: new MongoStore({ client: require('./db')}),
    resave: false,
    saveUninitialized:false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true
    }
});

const app = express();
const router = require('./router');
// const PORT = 3000;

app.use(sessionOptions);
app.use(flash());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/' , router);
app.use(express.static('public'));

app.set('View' , __dirname+'/views');
app.set('view engine', 'ejs');

module.exports = app;