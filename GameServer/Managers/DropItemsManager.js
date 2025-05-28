class DropItemsManager {
  constructor() {
    this._items = [];
  }

  async createDropItem(item, x, y, z) {
    const droppedItem = {
      item,
      x,
      y,
      z,
    }

    return droppedItem;
  }
}

module.exports = new DropItemsManager();