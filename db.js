const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();
MongoClient.connect(process.env.CONNSTRING , { useNewUrlParser: true , useUnifiedTopology: true })
    .then(client => {
        module.exports  = client;
        const app = require('./app');
        app.listen(process.env.PORT , function () {
            console.log(`listen to http://localhost:${ process.env.PORT }`);
        });
    }).catch(err => { console.log('error connection to database ',err) });