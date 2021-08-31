const { MongoClient, MongoNetworkError } = require('mongodb');

const connString = 'mongodb+srv://kflmattuk:doraemon08@cluster0.rjhl1.mongodb.net/Socialapp?retryWrites=true&w=majority';
const dbname = 'Socialapp';

MongoClient.connect(connString , { useUnifiedTopology: true }).then(client => {
    const db = client.db(dbname);
    module.exports  = db;
    const app = require('./app');
    app.listen(3000 , function () {
        console.log(`listen to http://localhost:3000`);
    });
}).catch(err => { console.log('error connection to database',err) });