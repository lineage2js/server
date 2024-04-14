const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacket = require("./ClientPacket");
const players = require('./../Models/Players');

class EnterWorld {
	constructor(packet, client) {
    this._client = client;
		this._data = new ClientPacket(packet);
		this._data.readC();

		this._init();
	}

	async _init() {
    const player = players.getPlayerByClient(this._client);

    this._client.sendPacket(new serverPackets.UserInfo(player));
    this._client.sendPacket(new serverPackets.SunRise());
	}
}

module.exports = EnterWorld;