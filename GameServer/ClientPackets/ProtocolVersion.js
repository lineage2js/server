const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacket = require("./ClientPacket");
const config = require('./../../config');

class ProtocolVersion {
	constructor(packet, client) {
    this._client = client;
		this._data = new ClientPacket(packet);
		this._data.readC()
			.readD();

		this._init();
	}

	get version() {
		return this._data.getData()[1];
	}

	_init() {
    if (this.version === config.main.PROTOCOL_VERSION_CLIENT) {
      this._client.sendPacket(new serverPackets.CryptInit(config.main.encryptionKeys.XOR), false);
    }
	}
}

module.exports = ProtocolVersion;