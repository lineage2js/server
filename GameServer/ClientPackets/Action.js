const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacket = require("./ClientPacket");
const entitiesManager = require('./../Managers/EntitiesManager');
const playersManager = require('./../Managers/PlayersManager');
const Npc = require('./../Models/Npc');
const Item = require('./../Models/Item');

class Action {
  constructor(packet, client) {
    this._client = client;
    this._data = new ClientPacket(packet);
    this._data.readC()
      .readD()
      .readD()
      .readD()
      .readD()
      .readC();

    this._init();
  }

  get objectId() {
    return this._data.getData()[1];
  }

  get originX() {
    return this._data.getData()[2];
  }

  get originY() {
    return this._data.getData()[3];
  }

  get originZ() {
    return this._data.getData()[4];
  }

  get actionId() {
    return this._data.getData()[5]; // 0 - click, 1 - shift click
  }

  _init() {
    const player = playersManager.getPlayerByClient(this._client);
    const entity = entitiesManager.getEntityByObjectId(this.objectId);

    if (entity instanceof Npc) {
      this._client.sendPacket(new serverPackets.TargetSelected(entity.objectId));
      this._client.sendPacket(new serverPackets.StatusUpdate(entity.objectId, entity.hp, entity.maximumHp));

      player.target = this.objectId;
    }

    if (entity instanceof Item) {
      player.updateJob('pickup', entity);
    }
  }
}

module.exports = Action;