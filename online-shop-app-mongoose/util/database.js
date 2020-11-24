const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect('mongodb+srv://rgederin:rownUovIp5jHzPQ2@cluster0.9acrc.mongodb.net/onlineshop?retryWrites=true&w=majority')
    .then(client => {
      console.log('connected to mongodb in cloud')
      _db = client.db('onlineshop');
      callback();
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw 'No database found'
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
