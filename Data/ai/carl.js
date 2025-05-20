const EventEmitter = require('events');

class Carl extends EventEmitter {
  onTalkSelected(talker) {
    this.showPage(talker, 'carl_q0201_01.htm');
    this.setMemo(talker, 201); // fighter_tutorial id
  }

  showPage(talker, html) {
    this.emit('showPage', talker, html);
  }

  setMemo(talker, memo) {
    this.emit('setMemo', talker, memo);
  }
}

module.exports = new Carl();