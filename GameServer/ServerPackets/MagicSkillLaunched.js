const ServerPacket = require('./ServerPacket.js'); 

class MagicSkillLaunched {
  constructor(character, skill) {
    this._packet = new ServerPacket(21);
    this._packet.writeC(0x8e)
      .writeD(character.objectId)
      .writeD(skill.id)
      .writeD(skill.level)
      .writeD(1)
      .writeD(character.target);
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = MagicSkillLaunched;