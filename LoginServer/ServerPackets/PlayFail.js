const ServerPacket = require('./ServerPacket.js'); 

class PlayFail {
  constructor(reason) {
    this._packet = new ServerPacket();
    this._packet.writeC(0x06)
      .writeC(reason);
  }

  static get reason() {
    return {
      REASON_SYSTEM_ERROR: 0x01,
      REASON_PASS_WRONG: 0x02,
    }
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = PlayFail;