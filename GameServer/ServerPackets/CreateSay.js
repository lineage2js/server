const ServerPacket = require('./ServerPacket.js'); 

class CreateSay {
  constructor(character, type, text) {
    this._packet = new ServerPacket(9 + ServerPacket.strlen(character.characterName) + ServerPacket.strlen(text));
    this._packet.writeC(0x5D)
      .writeD(character.objectId)
      .writeD(type)
      .writeS(character.characterName)
      .writeS(text);
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = CreateSay;