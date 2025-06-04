const characterStatusEnums = require('./../../enums/characterStatusEnums');

class EntitiesManager {
  constructor() {
    this._entities = [];
  }

  getEntityByObjectId(objectId) {
    return this._entities.find(entity => entity.objectId === objectId);
  }

  async enable() { // fix, load
    const npcManager = require('./NpcManager');
    const playersManager = require('./PlayersManager');
    const itemsManager = require('./ItemsManager');
    const botsManager = require('./BotsManager');
    const visibilityManager = require('./VisibilityManager');
    const aiManager = require('./AiManager');
    const dropItemsManager = require('./DropItemsManager');
    const serverPackets = require('./../ServerPackets/serverPackets');

    npcManager.on('spawn', npc => {
      this._entities.push(npc);

      const packet = new serverPackets.NpcInfo(npc);
      
      playersManager.emit('notify', packet);
    });

    npcManager.on('move', npc => {
      const packet = new serverPackets.MoveToLocation(npc.path, npc.objectId);
      
      playersManager.emit('notify', packet);
    });

    npcManager.on('attack', npc => {
      const packet = new serverPackets.Attack(npc, npc.target);
      
      playersManager.emit('notify', packet);
    });

    npcManager.on('changeMove', npc => {
      const packet = new serverPackets.ChangeMoveType(npc.objectId, 1); // running
      
      playersManager.emit('notify', packet);
    });

    npcManager.on('stop', npc => {
      const packet = new serverPackets.StopMove(npc.objectId, npc.x, npc.y, npc.z);

      playersManager.emit('notify', packet);
    });

    npcManager.on('died', async npc => {
      playersManager.emit('notify', new serverPackets.StatusUpdate(npc.objectId, [
        {
          id: characterStatusEnums.CUR_HP,
          value: 0,
        },
        {
          id: characterStatusEnums.MAX_HP,
          value: npc.maximumHp,
        }
      ]));
      playersManager.emit('notify', new serverPackets.Die(npc.objectId));

      setTimeout(() => {
        playersManager.emit('notify', new serverPackets.DeleteObject(npc.objectId));
      }, 3000);
    });

    npcManager.on('dropItems', async (npc, drop) => {
      console.log(npc.id, drop); // fix drop name var?

      const createdItem = await itemsManager.createItemByName(drop.itemName);
      const droppedItem = await dropItemsManager.createDropItem(createdItem, npc.x, npc.y, npc.z + 300);

      this._entities.push(droppedItem);

      playersManager.emit('notify', new serverPackets.DropItem(npc, {
        objectId: droppedItem.objectId,
        itemId: droppedItem.itemId,
        x: droppedItem.x,
        y: droppedItem.y,
        z: droppedItem.z
      }));
    });

    playersManager.on('spawn', player => {
      this._entities.push(player);

      //
      for (let i = 0; i < botsManager._bots.length; i++) {
        const packet = new serverPackets.CharacterInfo(botsManager._bots[i]);
      
        playersManager.emit('notify', packet); 
      }

      visibilityManager.addPlayer(player);
    });

    playersManager.on('move', player => {
      const packet = new serverPackets.MoveToLocation(player.path, player.objectId);
      
      playersManager.emit('notify', packet);
    });

    playersManager.on('updateExp', player => {
      const packet = new serverPackets.StatusUpdate(player.objectId, [
        {
          id: characterStatusEnums.EXP,
          value: player.exp
        }
      ]);
      
      playersManager.emit('notify', packet);
    });

    playersManager.on('updateLevel', player => {
      const packet = new serverPackets.StatusUpdate(player.objectId, [
        {
          id: characterStatusEnums.LEVEL,
          value: player.level,
        }
      ]);
      
      playersManager.emit('notify', packet);

      playersManager.emit('notify', new serverPackets.SocialAction(player.objectId, 15)); // fix
    });

    playersManager.on('pickup', (player, dropItem) => {
      {
        const packet = new serverPackets.GetItem(player, dropItem); // fix Может подписатся на event окончание доставки пактеа?
      
        playersManager.emit('notify', packet);

        player.addItem(dropItem.getItem());

        console.log(player.getItems())
      }

      {
        const packet = new serverPackets.DeleteObject(dropItem.objectId);
      
        playersManager.emit('notify', packet);
      }
    });

    botsManager.on('spawn', bot => {
      this._entities.push(bot);
    });

    botsManager.on('attack', bot => {
      const packet = new serverPackets.Attack(bot, bot.target);
      
      playersManager.emit('notify', packet);
    });

    botsManager.on('move', bot => {
      const packet = new serverPackets.MoveToLocation(bot.path, bot.objectId);
      
      playersManager.emit('notify', packet);
    });

    botsManager.on('pickup', (bot, item) => {
      {
        const packet = new serverPackets.GetItem(bot, item); // fix Может подписатся на event окончание доставки пактеа?
      
        playersManager.emit('notify', packet);
      }

      {
        const packet = new serverPackets.DeleteObject(item.objectId);
      
        playersManager.emit('notify', packet);
      }
    });

    aiManager.on('showPage', (talker, html) => {
      {
        const packet = new serverPackets.NpcHtmlMessage(html);
      
        playersManager.emit('notify', packet);
      }

      {
        const packet = new serverPackets.ActionFailed(); // fix?
      
        playersManager.emit('notify', packet);
      }
    });

    aiManager.on('setMemo', (talker, memo) => {
      //
      talker.quests.push({ id: memo, state: 0 });
      //

      const packet = new serverPackets.QuestList([
        {
          id: memo,
          numberState: 1
        }
      ]);
    
      playersManager.emit('notify', packet);
    });

    aiManager.on('soundEffect', (talker, soundName) => {
      const packet = new serverPackets.PlaySound(soundName);
      
      playersManager.emit('notify', packet);
    });

    aiManager.on('giveItem', async (talker, itemName) => {
      const item = await itemsManager.createItemByName(itemName);

      talker.addItem(item);
      
      const items = talker.getItems();
      const packet = new serverPackets.ItemList(items);

      playersManager.emit('notify', packet);
    });

    aiManager.on('deleteItem', (talker, itemName, itemCount) => {
      talker.deleteItemByName(itemName);
      
      const items = talker.getItems();
      const packet = new serverPackets.ItemList(items);

      playersManager.emit('notify', packet);
    });

    aiManager.on('sell', (talker, sellList, shopName, fnBuy) => {
      const packet = new serverPackets.BuyList(sellList);

      playersManager.emit('notify', packet);
    });
  }
}

module.exports = new EntitiesManager();