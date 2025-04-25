const EventEmitter = require('events');
const database = require('./../../Database');
const Item = require('./../Models/Item');

class ItemsManager extends EventEmitter {
  constructor() {
    super();

    this._items = [];

    this.on('createItem', async (x, y, z) => { // fix name
      const objectId = await database.getNextObjectId();
      const itemId = Math.floor(Math.random() * 100) + 1;
      const item = new Item(objectId, itemId, x, y, z);

      this._items.push(item);

      this.emit('createdItem', item);
    });
  }
}

module.exports = new ItemsManager();