const EventEmitter = require('events');

class Carl extends EventEmitter {
  onTalkSelected(talker) {
    const items = talker.getItemsFromInventory();
    const item = items.find(item => item.itemName === 'fox_fang1');

    if (item && item.getCount() === 4) {
      //this.giveItem(talker, 1067); // rec
      this.giveItem(talker, 'world_map');
      this.showPage(talker, "carl_q0201_02.htm");

      return;
    }

    this.showPage(talker, 'carl_q0201_01.htm');
    this.setMemo(talker, 201); // fighter_tutorial id
    this.soundEffect(talker, "ItemSound.quest_accept");
  }

  showPage(talker, html) {
    this.emit('showPage', talker, html);
  }

  setMemo(talker, memo) {
    this.emit('setMemo', talker, memo);
  }

  soundEffect(talker, soundName) {
    this.emit('soundEffect', talker, soundName);
  }

  giveItem(talker, itemName) {
    this.emit('giveItem', talker, itemName);
  }
}

module.exports = new Carl();