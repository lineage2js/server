const database = require('./../../Database');
const Item = require('./../Models/Item');

class ItemsManager {
  async createItem(itemId) {
    const objectId = await database.getNextObjectId();
    const item = new Item(objectId, itemId);

    return item;
  }
}

module.exports = new ItemsManager();