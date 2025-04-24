const ServerPacket = require('./ServerPacket.js');

class NpcInfo {
  constructor(npc) {
    this._packet = new ServerPacket(600);
    this._packet.writeC(0x22)
      .writeD(npc.objectId)
      .writeD(1000000 + npc.id)
      .writeD(npc.attacked)
      .writeD(npc.x)
      .writeD(npc.y)
      .writeD(npc.z)
      .writeD(0x00) // getHeading
      .writeD(0x00)
      .writeD(npc.mSpd) // getMagicalSpeed
      .writeD(npc.pSpd) // getPhysicalSpeed
      .writeD(npc.baseRunSpeed) // getRunSpeed
      .writeD(npc.baseWalkSpeed) // getWalkSpeed
      .writeD(50)	// swimspeed
      .writeD(20)	// swimspeed
      .writeD(50) // getFloatingRunSpeed
      .writeD(20) // getFloatingWalkSpeed
      .writeD(50) // getFlyingRunSpeed
      .writeD(20) // getFlyingWalkSpeed
      
      .writeF(1.1) // getMovementMultiplier
      .writeF((npc.pSpd / 500) / 0.555) // getAttackSpeedMultiplier
      .writeF(npc.collisionRadius) // getCollisionRadius
      .writeF(npc.collisionHeight) // getCollisionHeight
      .writeD(npc.rightHand) // getRightHandItem
      .writeD(0) // chest
      .writeD(npc.leftHand) // getLeftHandItem
      .writeC(1) // name above char 1=true ... ??
      .writeC(npc.isRunning ? 1 : 0) // walking=0 
      .writeC(0) // attacking 1=true
      .writeC(0) // dead 1=true
      
      .writeC(0) // invisible ?? 0=false  1=true   2=summoned (only works if model has a summon animation)
      
      .writeS(npc.characterName)
      .writeS(npc.title)
      .writeD(0)
      .writeD(0)
      .writeD(0)  // hmm karma ??
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = NpcInfo;