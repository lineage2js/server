const DefaultNpc = require('./DefaultNpc');

class Carl extends DefaultNpc {
  onTalkSelected(talker) {
    const items = talker.getItemsFromInventory();
    const item = items.find(item => item.itemName === 'fox_fang1');

    if (item && item.getCount() === 4) {
      this.giveItem(talker, 'recommendation_01');
      this.giveItem(talker, 'world_map');
      this.showPage(talker, "carl_q0201_02.htm");

      return;
    }

    this.showPage(talker, 'carl_q0201_01.htm');
    this.setMemo(talker, 201); // fighter_tutorial id
    this.soundEffect(talker, "ItemSound.quest_accept");
  }
}

module.exports = new Carl();