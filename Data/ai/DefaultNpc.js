const npcEventBus = require('./../../Core/Events/NpcEventBus');

class DefaultNpc {
  constructor() {
    this.npcEventBus = npcEventBus;
  }

  showPage(talker, htmlFileName) {
    this.npcEventBus.emit('showPage', talker, htmlFileName);
  }

  setMemo(talker, memo) {
    this.npcEventBus.emit('setMemo', talker, memo);
  }

  soundEffect(talker, soundName) {
    this.npcEventBus.emit('soundEffect', talker, soundName);
  }

  giveItem(talker, itemName) {
    this.npcEventBus.emit('giveItem', talker, itemName);
  }

  deleteItem(talker, itemName, itemCount) {
    this.npcEventBus.emit('deleteItem', talker, itemName, itemCount);
  }

  sell(talker, sellList, shopName, fnBuy) {
    this.npcEventBus.emit('sell', talker, sellList, shopName, fnBuy);
  }

  addFleeDesire(attacker) {    
    this._npc.updateState('stop');
    // fix
    const positions = this._npc._getRandomPos(this._npc.coordinates);

    let path = {
      target: {
        x: positions[0],
        y: positions[1],
        z: -3115
      },
      origin: {
        x: this._npc.x,
        y: this._npc.y,
        z: this._npc.z
      }
    }

    this._npc.job = 'patrol';
    this._npc.updateState('move', path);

    console.log(this._npc);
    //
  }

  showSkillList(talker) {
    this.npcEventBus.emit('showSkillList', talker);
  }
}

module.exports = DefaultNpc;