const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacket = require("./ClientPacket");
const Character = require('./../Models/Character');
const database = require('./../../Database');
const characterTemplates = require('./../data/characterTemplates.json');
const players = require('./../Models/Players');

class CharacterCreate {
	constructor(packet, client) {
    this._client = client;
		this._data = new ClientPacket(packet);
		this._data.readC()
			.readS()
			.readD()
			.readD()
			.readD()
			.readD()
			.readD()
			.readD()
			.readD()
			.readD()
			.readD()
			.readD()
			.readD()
			.readD();

		this._init();
	}

  get name() {
		return this._data.getData()[1];
	}

	get race() {
		return this._data.getData()[2];
	}

	get gender() {
		return this._data.getData()[3];
	}

	get classId() {
		return this._data.getData()[4];
	}

	get hairStyle() {
		return this._data.getData()[11];
	}

	get hairColor() {
		return this._data.getData()[12];
	}

	get face() {
		return this._data.getData()[13];
	}

  _checkNameLetters(name) {
    const regexp = /^[0-9A-Za-z]*$/gi;

		if (regexp.test(name)) {
      return true;
    } else {
      return false;
    }
	}

  async checkMaxNumberCharacters(login) {
    const characters = await database.getCharactersByLogin(login);
    const MAXIMUM_NUMBER_OF_CHARACTERS = 7;

    if (characters.length >= MAXIMUM_NUMBER_OF_CHARACTERS) {
      return true;
    } else {
      return false;
    }
  }

	async _init() {
    const player = players.getPlayerByClient(this._client);
    
    if (await this.checkMaxNumberCharacters(player.login)) {
      this._client.sendPacket(new serverPackets.CharacterCreateFail(serverPackets.CharacterCreateFail.reason.REASON_TOO_MANY_CHARACTERS))
      
      return;
    }

    const isUsedName = await database.checkNameExist(this.name);

    if (isUsedName) {
      this._client.sendPacket(new serverPackets.CharacterCreateFail(serverPackets.CharacterCreateFail.reason.REASON_NAME_ALREADY_EXISTS))
      
      return;
    }

    if(this.name.length >= 16 || !this._checkNameLetters(this.name)) {
      this._client.sendPacket(new serverPackets.CharacterCreateFail(serverPackets.CharacterCreateFail.reason.REASON_16_ENG_CHARS))

      return;
    }

    const characterTemplate = characterTemplates.find(characterTemplate => {
      if (characterTemplate.classId === this.classId) {
        return true;
      } else {
        return false;
      }
    });
    const character = Character.create(characterTemplate);

    character.name = this.name;
    character.objectId = await database.getNextObjectId();
    character.login = player.login;
    character.maximumHp = character.hp;
		character.maximumMp = character.mp;
    character.gender = this.gender;
    character.hairStyle = this.hairStyle;
    character.hairColor = this.hairColor;
    character.face = this.face;

    //fix
    character.swimSpeed = 1;
    character.canCraft = 0;
    character.maleMovementMultiplier = null;
    character.maleAttackSpeedMultiplier = null;
    character.maleCollisionRadius = null;
    character.maleCollisionHeight = null;
    
    character.femaleMovementMultiplier = null;
    character.femaleAttackSpeedMultiplier = null;
    character.femaleCollisionRadius = null;
    character.femaleCollisionHeight = null;

    character.pAtk = 1;
    character.pSpd = 1;
    character.pDef = 1;
    character.evasion = 1;
    character.accuracy = 1;
    character.critical = 1;

    character.mAtk = 1;
    character.mSpd = 1;
    character.pSpd = 1;
    character.mDef = 1;

    character.items = null;
    //

    await database.addCharacter(character);

    const characters = await database.getCharactersByLogin(player.login);
    
    this._client.sendPacket(new serverPackets.CharacterCreateSuccess());
    this._client.sendPacket(new serverPackets.CharacterSelectInfo(player.login, characters));
	}
}

module.exports = CharacterCreate;