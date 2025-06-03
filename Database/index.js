const MongoClient = require("mongodb").MongoClient;

class Database {
  constructor() {
    this._db = null;
  }

  async connect(host, dbname, callback) {
    try {
      const mongoClient = new MongoClient(`mongodb://${host}/`);

      await mongoClient.connect();
      
      this._db = mongoClient.db(dbname);

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
    const document = {};

    for (const key in character) {
      if (key.startsWith('_')) {
        continue;
      }

      document[key] = character[key];
    }

    await this._db.collection('characters').insertOne(document);
  }

  async updateCharacterByObjectId(objectId, character) {
    await this._db.collection('characters').updateOne(
      { objectId },
      {
        $set: {
          x: character.x,
          y: character.y,
          z: character.z
        }
      }
    ); // fix?
  }

  async getCharacterByLogin(login) {
    return await this._db.collection('characters').findOne({ login });
  }

  async getCharactersByLogin(login) { // fix delete
    return await this._db.collection('characters').find({ login }).toArray();
  }

  async getCharacterByObjectId(objectId) {
    return await this._db.collection('characters').findOne({ objectId });
  }

  async checkCharacterNameExists(characterName) {
    const character = await this._db.collection('characters').findOne({
      'characterName': {
        $regex: `^${characterName}$`,
        $options: 'i'
      }
    });

    if (character) {
      return true;
    } else {
      return false;
    }
  }

  async getCharactersOnline() {
    const characters = await this._db.collection('characters').find({ online: true }).toArray();

    return characters.length;
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

  async addInventory(document) {
    await this._db.collection('inventories').insertOne(document);
  }

  async getInventoryByObjectId(objectId) {
    return await this._db.collection('inventories').findOne({ objectId });
  }

  async deleteInventoryByObjectId(objectId) {
    await this._db.collection('inventories').deleteOne({ objectId });
  }
}

module.exports = new Database();