const ServerPacket = require('./ServerPacket.js'); 

class LoginOk {
  constructor(sessionKey1) {
    this._packet = new ServerPacket(48);
    this._packet.writeC(0x03)
      .writeD(sessionKey1[0])
      .writeD(sessionKey1[1])
      .writeD(0x00)
      .writeD(0x00)
      .writeD(0x00)
      .writeD(0x00)
      .writeD(0x00)
      .writeD(0x00);
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = LoginOk;