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

  sendPacket(packetInstance, encoding = true) {
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

  _getCroppedPacket(data) {
    const buffer = Buffer.from(data, 'binary');
    const croppedPacket = buffer.subarray(2);
    
    return croppedPacket;
  }

  _getDecryptedPacket(packet) {
    const decryptedPacket = blowfish.decrypt(packet);
    const buffer = Buffer.from(decryptedPacket);

    return buffer;
  }

  _getOpcode(packet) {
    return packet[0];
  }

  _getPayloadPacket(packet) {
    return packet.subarray(1);
  }

  _onData(data) {
    const croppedPacket = this._getCroppedPacket(data);
    const decryptedPacket = this._getDecryptedPacket(croppedPacket);
    const opcode = this._getOpcode(decryptedPacket);
    const payloadPacket = this._getPayloadPacket(decryptedPacket);

    console.log(`opcode: [0x${opcode.toString(16).toUpperCase().padStart(2, '0')}]`);
    
    switch(opcode) {
      case 0x00:
        new clientPackets.RequestAuthLogin(this, payloadPacket);

        break;
      case 0x02:
        new clientPackets.RequestServerLogin(this, payloadPacket);

        break;
      case 0x05:
        new clientPackets.RequestServerList(this, payloadPacket);

        break;
      }
  }

  _onClose() {
    console.log("client disconnect from login server");
  }

  _init() {
    const sessionID = 0x00000000;

    this._socket.setEncoding('binary');
    this._socket.on('error', () => {});
    this._socket.on('data', this._onData.bind(this));
    this._socket.on('close', this._onClose.bind(this));

    this.sendPacket(new serverPackets.InitLS(sessionID), false);
  }
}

module.exports = Client;