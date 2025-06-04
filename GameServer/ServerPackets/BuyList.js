const ServerPacket = require('./ServerPacket.js');
const itemsManager = require('./../Managers/ItemsManager');

class BuyList {
  constructor(items) {
    this._packet = new ServerPacket(13 + (items.length * (22)));
    this._packet.writeC(0x1D)
      .writeD(1000) // money
      .writeD(0) // buyListId ?
      .writeD(items.length) // items length

    for (let i = 0; i < items.length; i++) {
      const [key] = Object.keys(items[i]);
      const item = itemsManager.createItemByName(key);

      this._packet.writeH(1)
        .writeD(item.objectId)
        .writeD(item.itemId)
        .writeD(1)
        .writeH(1)
        .writeH(0)
        .writeD(10)
    }

  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = BuyList;