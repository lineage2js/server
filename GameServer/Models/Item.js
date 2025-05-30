class Item {
  constructor(objectId, itemId, consume_type) {
    this.objectId = objectId;
    this.itemId = itemId;
    this.consume_type = consume_type;
    this._count = 1;
  }

  get isStackable() {
    if (this.consume_type === 'consume_type_stackable' || this.consume_type === 'consume_type_asset') {
      return true;
    } else {
      return false;
    }
  }

  getCount() {
    return this._count;
  }

  updateCount(value) {
    this._count = value;
  }
}

module.exports = Item;