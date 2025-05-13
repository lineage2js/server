const ServerPacket = require('./ServerPacket.js'); 

class SkillList {
  constructor(skills) {
    this._packet = new ServerPacket(5 + (12 * skills.length));
    this._packet.writeC(0x6d)
      .writeD(skills.length);

    for (let i = 0; i < skills.length; i++) {
      const skill = skills[i];

      this._packet.writeD(skill.passive)
        .writeD(skill.level)
        .writeD(skill.id);
    }
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = SkillList;