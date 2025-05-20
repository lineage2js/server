const EventEmitter = require('events');

class Carl extends EventEmitter {
  onTalkSelected(talker) {
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
}

module.exports = new Carl();