const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacket = require("./ClientPacket");
const entitiesManager = require('./../Managers/EntitiesManager');
const playersManager = require('./../Managers/PlayersManager');
const Npc = require('./../Models/Npc');
const Item = require('./../Models/Item');
const сharacterStatusEnums = require('./../../enums/сharacterStatusEnums');

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
      if (player.target !== null && !player.isAttacking) {
        player.isAttacking = true;
        
        player.updateJob('attack', this.objectId);
        return;
      }

      this._client.sendPacket(new serverPackets.TargetSelected(entity.objectId));
      this._client.sendPacket(new serverPackets.StatusUpdate(entity.objectId, [
        {
          id: сharacterStatusEnums.CUR_HP,
          value: entity.hp,
        },
        {
          id: сharacterStatusEnums.MAX_HP,
          value: entity.maximumHp,
        }
      ]));

      player.target = this.objectId;
    }

    if (entity instanceof Item) {
      player.updateJob('pickup', entity);
    }
  }
}

module.exports = Action;