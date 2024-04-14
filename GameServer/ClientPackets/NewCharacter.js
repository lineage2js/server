const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacket = require("./ClientPacket");
const characterTemplates = require('./../data/characterTemplates.json');

class NewCharacter {
	constructor(packet, client) {
    this._client = client;
		this._data = new ClientPacket(packet);
		this._data.readC();

		this._init();
	}

	_init() {
    this._client.sendPacket(new serverPackets.CharacterTemplates(characterTemplates));
	}
}

module.exports = NewCharacter;