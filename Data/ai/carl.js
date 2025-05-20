const EventEmitter = require('events');

class Carl extends EventEmitter {
  onTalkSelected(talker) {
    this.showPage(talker, 'carl_q0201_01.htm');
  }

  showPage(talker, html) {
    this.emit('showPage', talker, html);
  }
}

module.exports = new Carl();