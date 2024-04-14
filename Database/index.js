const MongoClient = require("mongodb").MongoClient;
const mongoClient = new MongoClient("mongodb://127.0.0.1:27017/");

class Database {
  constructor() {
    this._db = null;
  }

  async connect(callback) {
    try {
      await mongoClient.connect();
      
      this._db = mongoClient.db("l2db");

      callback();
    } catch {
      throw new Error("database connected: failed");
    }
  }
  
  async getAccountByLogin(login) {
    const user = await this._db.collection('accounts').findOne({ login });

    if (user) {
      return user;
    } else {
      return null;
    }
  }

  async addCharacter(character) {
    await this._db.collection('characters').insertOne(character);
  }

  async getCharactersByLogin(login) {
    return await this._db.collection('characters').find({ login }).toArray();
  }

  async checkNameExist(name) {
    const character = await this._db.collection('characters').findOne({ name });

    if (character) {
      return true;
    } else {
      return false;
    }
  }

  async getNextObjectId() {
    const objectId = await this._db.collection('counters').findOne(
      {
        "objectId": {
          $exists : true
        }
      },
      {
        projection: {
          _id: 0,
          "last": "$objectId.last",
          "start": "$objectId.start",
        }
      }
    );
    
    await this._db.collection('counters').updateOne(
      {
        "objectId": { 
          $exists : true 
        }
      },
      {
        $inc: {
          "objectId.last": 1
        }
      }
    );
    
    return objectId.start + objectId.last;
  }

  async deleteCharacterByObjectId(objectId) {
    await this._db.collection('characters').deleteOne({ objectId });
  }
}

module.exports = new Database();