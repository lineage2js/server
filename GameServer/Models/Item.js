class Item {
  constructor(objectId, itemId, consume_type, item_type, itemName) {
    this.objectId = objectId;
    this.itemId = itemId;
    this.consume_type = consume_type;
    this.item_type = item_type;
    this.itemName = itemName;
    this._count = 1;
  }

  get isStackable() {
    if (this.consume_type === 'consume_type_stackable' || this.consume_type === 'consume_type_asset') {
      return true;
    } else {
      return false;
    }
  }

  get isQuestItem() {
    if (this.item_type === 'questitem') {
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