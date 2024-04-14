const ServerPacket = require('./ServerPacket.js'); 

class CharacterDeleteOk {
	constructor() {
    this._packet = new ServerPacket(1);
    this._packet.writeC(0x33);
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = CharacterDeleteOk;