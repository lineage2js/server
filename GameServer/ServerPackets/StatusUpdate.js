const ServerPacket = require('./ServerPacket.js'); 

class StatusUpdate {
  constructor(objectId, attributes) { // fix
    this._packet = new ServerPacket(17);
    this._packet.writeC(0x1a)
      .writeD(objectId)
      .writeD(attributes.length)

    for(let i = 0; i < attributes.length; i++) {
      this._packet.writeD(attributes[i].id)
        .writeD(attributes[i].value);
    }
      
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = StatusUpdate;