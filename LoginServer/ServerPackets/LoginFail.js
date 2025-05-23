const ServerPacket = require('./ServerPacket.js'); 

class LoginFail {
  constructor(reason) {
    this._packet = new ServerPacket();
    this._packet.writeC(0x01)
      .writeC(reason);
  }

  static get reason() {
    return {
      REASON_SYSTEM_ERROR: 0x01,
      REASON_PASS_WRONG: 0x02,
      REASON_USER_OR_PASS_WRONG: 0x03,
      REASON_ACCESS_FAILED: 0x04,
      REASON_ACCOUNT_IN_USE: 0x07,
      REASON_ACCOUNT_BANNED: 0x09,
    }
  }

  getBuffer() {
    return this._packet.getBuffer();
  }
}

module.exports = LoginFail;