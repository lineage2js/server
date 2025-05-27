const database = require('./../../Database');
const Item = require('./../Models/Item');

class ItemsManager {
  async createItem(itemId, x, y, z) {
    const objectId = await database.getNextObjectId();
    const item = new Item(objectId, itemId, x, y, z);

    return item;
  }
}

module.exports = new ItemsManager();