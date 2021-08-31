const dotenv = require('dotenv');
dotenv.config();
const { MongoClient, MongoNetworkError } = require('mongodb');
const dbname = 'Socialapp';

MongoClient.connect(process.env.CONNSTRING , { useUnifiedTopology: true }).then(client => {
    const db = client.db(dbname);
    module.exports  = db;
    const app = require('./app');
    app.listen(process.env.PORT , function () {
        console.log(`listen to http://localhost:${ process.env.PORT }`);
    });
}).catch(err => { console.log('error connection to database',err) });
