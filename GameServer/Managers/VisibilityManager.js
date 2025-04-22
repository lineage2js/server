// const npcManager = require('./NpcManager');
// const playersManager = require('./PlayersManager');

class VisibilityManager {
  constructor() {
    this._npcs = [];
    this._players = [];

    // listVisibleObjects
  }

  enable() {
    // npcManager.on('spawn', npc => {
    //   this._npcs.push(npc);
    // });

    // playersManager.on('spawn', player => {
    //   this._players.push(player);
    // });
  }
}

module.exports = new VisibilityManager();