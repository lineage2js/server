const ServerPacket = require('./ServerPacket.js'); 

class ItemList {
  constructor(items, showWindow = false) {
    this._packet = new ServerPacket(5 + (28 * items.length));
    this._packet.writeC(0x27)
      .writeH(showWindow ? 0x01 : 0x00)
      .writeH(items.length)

    for(let i = 0; i < items.length; i++) {
      this._packet.writeH(0) // items[i].type1
        .writeD(items[i].objectId)
        .writeD(items[i].itemId)
        .writeD(0x01) // getCount
        .writeH(0) // items[i].type2
        .writeH(0xff)
        .writeH(0x00) // items[i].isEquipped ? 0x01 : 0x00 // вещь на персонаже или нет
        .writeD(0x00) // items[i].bodyPart
        .writeH(0x00) // getEnchantLevel
        .writeH(0x00);
    }
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = ItemList;