const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacket = require("./ClientPacket");
const players = require('./../Models/Players');

class MoveBackwardToLocation {
	constructor(packet, client) {
    this._client = client;
		this._data = new ClientPacket(packet);
		this._data.readC()
			.readD()
			.readD()
			.readD()
			.readD()
			.readD()
			.readD();

		this._init();
	}

  get targetX() {
		return this._data.getData()[1];
	}
	get targetY() {
		return this._data.getData()[2];
	}
	get targetZ() {
		return this._data.getData()[3];
	}
	get originX() {
		return this._data.getData()[4];
	}
	get originY() {
		return this._data.getData()[5];
	}
	get originZ() {
		return this._data.getData()[6];
	}

	_init() {
    const player = players.getPlayerByClient(this._client);
    const positions = {
			target: {
				x: this.targetX,
				y: this.targetY,
				z: this.targetZ
			},
			origin: {
				x: this.originX,
				y: this.originY,
				z: this.originZ
			}
		}

    this._client.sendPacket(new serverPackets.MoveToLocation(positions, player.objectId));
	}
}

module.exports = MoveBackwardToLocation;