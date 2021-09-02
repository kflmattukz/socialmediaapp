# Social Media App
## learn express & tailwind css

### technology i use
    - Express (Web Framework for Node.js)
        - Express-session (manage Session on Express)
    - EJS (Template Engine)
    - Tailwind css (Css library A Utility First Framework)
    - MongoDB (Dataase with JSON model data Support)
        - MongoStore (save Session to MongoDB)
    - flash connect-flash (manage Flash message)
    - dotenv (manage .env file)

#### express
```npm
npm install express
```
```javascript
const express = require('express');
const app = express();
//LISTEN to PORT 3000
app.listen(3000);
```

### EJS
```npm
npm install ejs
```

```javascript
//Set views Folder
app.set('View' , __dirname+'/views');
//Set view Engine to EJS
app.set('view engine', 'ejs');
```

#### tailwindcss
[tailwindcss css installation]('https://tailwindcss.com/docs/installation')


#### mongoDB
 - create mongoDB account and create a database or install mondoDB localy 
 - install mongodb driver (you can install any driver you want)
```npm
npm install mongodb
```
 - get Token connection from website or MongoDB App
 - if you make database from website make sure to add you IP address so you can connect to MondoDB database
```javascript
const { MongoClient } = require('mongodb');
const connString = //your mongoDB token connection
const MongoClient.connect(connString , { useUnifiedTopology: true }).then(client => {
    module.exports = client;
}).catch(err => () {
    console.log(`ERROR ${err}`)
})
```

#### express session
```npm
npm install express-session
```

```javascript
const session = require('express-session');

const sessionOptions = session({
    secret: 'your Secret word/key/prase',
    // to save session to mongoDB database
    store: new MongoStore({ client: require('./db')}),
    resave: false,
    saveUninitialized:false,
    cookie: {
        //Set time expired to a day 
        //you can set whatever you want
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true
    }
})

app.use(sessionOptions);
```

#### Flash (connect-flash)
```npm
npm install connect-flash
```

```javascript
const flash = require('connect-flash');

app.use(flash());
```

#### dotenv
```npm
npm install dotenv
```

```javascript
const dotenv = require('dotenv');
dotenv.config();
```