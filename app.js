const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const markdown = require('marked');
const sanitizeHTML = require('sanitize-html')

const sessionOptions = session({
    secret: process.env.SECRET_KEY,
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
// const { ObjectId } = require('bson');

app.use(sessionOptions);
app.use(flash());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//save the data to locals
app.use(function (req ,res , next) {
    //
    res.locals.filterUserHTML = function (content) {
        return sanitizeHTML(markdown(content) , {allowedTags: ['p' ,'ol' , 'ul' , 'li' , 'strong' , 'bold' ,'italic' , 'underline' , 'em' , 'h1' , 'h2' ,'h3' ,'h4' ,'h5' ,'h6'] , allowedAttributes: {}})
    }
    if ( req.session.user ) {
        req.visitorId = req.session.user._id
    } else {
        req.visitorId = 0
    }

    res.locals.errors = req.flash('errors')
    res.locals.success = req.flash('success')
    //make a data user available on local
    res.locals.user = req.session.user;
    next();
});

app.use('/' , router);
app.use(express.static('public'));

app.set('View' , __dirname+'/views');
app.set('view engine', 'ejs');

const server = require('http').createServer(app)

const io = require('socket.io')(server)

io.on('connection' , function (socket) {
    socket.on('chatMsgFromBrowser' , function(data) {
        console.log(`msg from server ${ data.message }`)
        io.emit('chatMsgFromServer' , { message: data.message })
    })
})
module.exports = server;