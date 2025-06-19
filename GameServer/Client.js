// const XOR = require('./libs/XOR.js');
// const xor = new XOR([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
const clientPackets = require('./ClientPackets/clientPackets');

class Client {
  constructor(socket) {
    this._socket = socket;
    this._protocolVersion = null;
    
    this._init();
  }

  sendPacket(packetInstance, encoding = true) {
    const buffer = packetInstance.getBuffer();
    const packetLength = this._getPacketLength(buffer);
    let payload = buffer;

    // if (encoding) {
    //   payload = Buffer.from(blowfish.encrypt(buffer));
    // }

    const packet = Buffer.concat([packetLength, payload]);

    this._socket.write(packet);
  }

  setProtocolVersion(value) {
    this._protocolVersion = value;
  }
  
  getProtocolVersion() {
    return this._protocolVersion;
  }

  _getPacketLength(buffer) {
    const length = Buffer.from([0x00, 0x00]);
    
    length.writeInt16LE(buffer.length + 2);

    return length;
  }

  _onData(data) {
    const cropped = (Buffer.from(data, 'binary')).slice(2);
    const packet = Buffer.from(cropped);
    const opcode = packet[0];

    console.log(`opcode: [0x${opcode.toString(16).toUpperCase().padStart(2, '0')}]`);

    switch(opcode) {
      case 0x00:
        new clientPackets.ProtocolVersion(packet, this);

        break;
      case 0x04:
        new clientPackets.Action(packet, this);

        break;
      case 0x08:
        new clientPackets.RequestAuthLogin(packet, this);

        break;
      case 0x0D:
        new clientPackets.CharacterSelected(packet, this);

        break;
      case 0x63:
        new clientPackets.RequestQuestList(packet, this);

        break;
      case 0x03:
        new clientPackets.EnterWorld(packet, this);
  
        break;
      case 0x0E:
        new clientPackets.NewCharacter(packet, this);

        break;
      case 0x0B:
        new clientPackets.CharacterCreate(packet, this);

        break;
      case 0x0C:
        new clientPackets.CharacterDelete(packet, this);

        break;
      case 0x01:
        new clientPackets.MoveBackwardToLocation(packet, this);
  
        break;
      case 0x0A:
        new clientPackets.RequestAttack(packet, this);

        break;
      case 0x09:
        new clientPackets.Logout(packet, this);
  
        break;
      case 0x46:
        new clientPackets.RequestRestart(packet, this);

        break;
      case 0x37:
        new clientPackets.RequestTargetCancel(packet, this);

        break;
      case 0x0F:
        new clientPackets.RequestItemList(packet, this);

        break;
      case 0x33:
        new clientPackets.RequestShortCutReg(packet, this);

        break;
      case 0x21:
        new clientPackets.RequestBypassToServer(this, packet);

        break;
      case 0x3F:
        new clientPackets.RequestSkillList(this, packet);

        break;
      case 0x2F:
        new clientPackets.RequestMagicSkillUse(this, packet);

        break;
      case 0x57:
        new clientPackets.RequestShowBoard(this, packet);

        break;
      case 0x1B:
        new clientPackets.RequestSocialAction(this, packet);

        break;
      case 0x48:
        new clientPackets.ValidatePosition(this, packet);

        break;
      case 0x45:
        new clientPackets.RequestActionUse(this, packet);

        break;
      case 0x38:
        new clientPackets.Say2(this, packet);

        break;
      case 0x5B:
        new clientPackets.SendBypassBuildCmd(this, packet);

        break;
      case 0x20:
        new clientPackets.RequestLinkHtml(this, packet);
  
        break;
      case 0x14:
        new clientPackets.RequestUseItem(this, packet);

        break;
      case 0x11:
        new clientPackets.RequestUnEquipItem(this, packet);

        break;
      case 0x36:
        new clientPackets.CanNotMoveAnymore(this, packet);

        break;
      case 0x1F:
        new clientPackets.RequestBuyItem(this, packet);

        break;
      case 0x6D:
        new clientPackets.RequestRestartPoint(this, packet);

        break;
    }
  }

  _onClose() {
    console.log("client disconnect from login server");
  }

  _init() {
    this._socket.setEncoding('binary');
    this._socket.on('error', () => {});
    this._socket.on('data', this._onData.bind(this));
    this._socket.on('close', this._onClose.bind(this));
  }
}

module.exports = Client;