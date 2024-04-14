const XOR = require('./libs/XOR.js');
const xor = new XOR([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
const clientPackets = require('./ClientPackets/clientPackets');

class Client {
  constructor(socket) {
    this._socket = socket;
    
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

  _getPacketLength(buffer) {
    const length = Buffer.from([0x00, 0x00]);
    
    length.writeInt16LE(buffer.length + 2);

    return length;
  }

  _onData(data) {
    const cropped = (Buffer.from(data, 'binary')).slice(2);
    const packet = Buffer.from(cropped);
    const opcode = packet[0];

    console.log("opcode: ", opcode);

    switch(opcode) {
      case 0:
        new clientPackets.ProtocolVersion(packet, this);

        break;
      case 8:
        new clientPackets.RequestAuthLogin(packet, this);

        break;
      case 13:
        new clientPackets.CharacterSelected(packet, this);

        break;
      case 99:
        new clientPackets.RequestQuestList(packet, this);

        break;
      case 3:
        new clientPackets.EnterWorld(packet, this);
  
        break;
      case 14:
        new clientPackets.NewCharacter(packet, this);

        break;
      case 11:
        new clientPackets.CharacterCreate(packet, this);

        break;
      case 12:
        new clientPackets.CharacterDelete(packet, this);

        break;
      case 1:
        new clientPackets.MoveBackwardToLocation(packet, this);
  
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