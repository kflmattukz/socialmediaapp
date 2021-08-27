const express = require('express');
const app = express();
const router = require('./router');
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/' , router);
app.use(express.static('public'));
app.set('View' , __dirname+'/views');
app.set('view engine', 'ejs');

app.listen(PORT , () => {
    console.info(`Listen to http://localhost:${ PORT }`);
});