const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

module.exports.ObjectId = ObjectId;

const url = "mongodb://localhost:27017";
const dbName = "login";

const connectDB = (collectionName, callback) => {
    MongoClient.connect(
        url, function (err, client) {
            const db = client.db(dbName);
            const collection = db.collection(collectionName);
            callback(err, client, collection);
        }
    );
};

module.exports.findList = (collectionName, params, callback) => {
    connectDB(collectionName, (err, client, collection) => {
        collection.find(params).toArray((err, docs) => {
            client.close();
            callback(err, docs)
        })

    })
};

module.exports.findOne = (collectionName, params, callback) => {
    connectDB(collectionName, (err, client, collection) => {
        collection.findOne(params, (err, doc) => {
            client.close();
            callback(err, doc)
        })
    })
};

module.exports.insertOne = (collectionName, params, callback) => {
    connectDB(collectionName, (err, client, collection) => {
        collection.insertOne(params, (err, result) => {
            client.close();
            callback(err, result)

        })
    })
};

module.exports.updateOne = (collectionName, condition, params, callback) => {
    connectDB(collectionName, (err, client, collection) => {
        collection.updateOne(condition, {
            $set: params
        }, (err, result) => {
            client.close();
            callback(err, result);
        })
    })
};

module.exports.deleteOne = (collectionName, params, callback) => {
    connectDB(collectionName, (err, client, collection) => {
        collection.deleteOne(params, (err, result) => {
            client.close();
            callback(err, result);
        })
    })
};