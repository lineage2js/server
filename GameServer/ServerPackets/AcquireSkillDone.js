const ServerPacket = require('./ServerPacket.js'); 

class AcquireSkillDone {
  constructor() {
    this._packet = new ServerPacket(1);
    this._packet.writeC(0xA7);
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = AcquireSkillDone;