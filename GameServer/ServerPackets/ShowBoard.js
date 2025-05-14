const ServerPacket = require('./ServerPacket.js'); 

class ShowBoard {
  constructor(html) {
    this._packet = new ServerPacket(1 + ServerPacket.strlen(html) + ServerPacket.strlen("") + ServerPacket.strlen("") + ServerPacket.strlen("") + ServerPacket.strlen("") + ServerPacket.strlen("") + ServerPacket.strlen(""));
    this._packet.writeC(0x86)
      .writeS("") // top
      .writeS("")
      .writeS("")
      .writeS("")
      .writeS("")
      .writeS("")
      .writeS(html);
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = ShowBoard;