const config = require('./../config')
const BlowfishEngine = require('./libs/blowfish.js');
const blowfish = new BlowfishEngine(config.main.encryptionKeys.blowfish);
const clientPackets = require('./ClientPackets/clientPackets');
const serverPackets = require('./ServerPackets/serverPackets');

class Client {
  constructor(socket) {
    this._socket = socket;
    
    this._init();
  }

  sendPacket(packetInstance , encoding = true) {
    const buffer = packetInstance.getBuffer();
    const packetLength = this._getPacketLength(buffer);
    let payload = buffer;

    if (encoding) {
      payload = Buffer.from(blowfish.encrypt(buffer));
    }

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
    const packet = (Buffer.from(blowfish.decrypt(cropped)));
    const opcode = packet[0];

    console.log("opcode: ", opcode);

    switch(opcode) {
      case 0:
        new clientPackets.RequestAuthLogin(packet, this);

        break;
      case 2:
        new clientPackets.RequestServerLogin(packet, this);

        break;
      case 5:
        new clientPackets.RequestServerList(packet, this);

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

    this.sendPacket(new serverPackets.InitLS(), false);
  }
}

module.exports = Client;