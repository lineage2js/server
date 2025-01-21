const MongoClient = require("mongodb").MongoClient;
const config = require('../config');
const mongoClient = new MongoClient(`mongodb://${config.database.host}/`);

class Database {
  constructor() {
    this._db = null;
  }

  async connect(callback) {
    try {
      await mongoClient.connect();
      
      this._db = mongoClient.db(config.database.dbname);

      callback();
    } catch {
      throw new Error("database connected: failed");
    }
  }
  
  async getUserByLogin(login) {
    const user = await this._db.collection('users').findOne({ login });

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

  async checkCharacterNameExists(name) {
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

  async addGameServer(params) {
    await this._db.collection('gameservers').insertOne({
      id: params.id, 
      host: params.host,
      port: params.port,
      ageLimit: params.ageLimit,
      isPvP: params.isPvP,
      maxPlayers: params.maxPlayers,
      status: params.status,
      type: params.type
    });
  }

  async getGameServers() {
    return await this._db.collection('gameservers').find().toArray();
  }

  async getGameServerById(id) {
    const gameserver = await this._db.collection('gameservers').findOne({ id });

    if (gameserver) {
      return gameserver;
    } else {
      return null;
    }
  }

  async checkGameServerExistsById(id) {
    const gameserver = await this._db.collection('gameservers').findOne({ id });

    if (gameserver) {
      return true;
    } else {
      return false;
    }
  }

  async updateGameServerById(id, field, value) {
    await this._db.collection('gameservers').updateOne(
      { id },
      {
        $set: {
          [field]: value
        }
      }
    );
  }
}

module.exports = new Database();