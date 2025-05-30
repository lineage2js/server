const database = require('./../../Database');
const Item = require('./../Models/Item');
const itemsList = require('./../../Data/itemsList.json');

class ItemsManager {
  async createItem(itemName) {
    const itemData = itemsList.find(i => i.name === itemName);

    const objectId = await database.getNextObjectId();
    const item = new Item(objectId, itemData.id, itemData.consume_type, itemData.item_type, itemData.name);

    return item;
  }
}

module.exports = new ItemsManager();