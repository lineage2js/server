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

  _checkCharacterNameLetters(name) {
    const regexp = /^[0-9A-Za-z]*$/gi;

    if (regexp.test(name)) {
      return true;
    } else {
      return false;
    }
  }

  async checkMaxNumberCharacters(login) {
    const MAXIMUM_NUMBER_OF_CHARACTERS = 7;
    const characters = await database.getCharactersByLogin(login);

    if (characters.length >= MAXIMUM_NUMBER_OF_CHARACTERS) {
      return true;
    } else {
      return false;
    }
  }

  async _init() {
    const MAXIMUM_LENGTH_CHARACTER_NAME = 16;
    const player = players.getPlayerByClient(this._client);
    
    if (await this.checkMaxNumberCharacters(player.login)) {
      this._client.sendPacket(new serverPackets.CharacterCreateFail(serverPackets.CharacterCreateFail.reason.REASON_TOO_MANY_CHARACTERS))
      
      return;
    }

    const isUsedCharacterName = await database.checkCharacterNameExists(this.name);

    if (isUsedCharacterName) {
      this._client.sendPacket(new serverPackets.CharacterCreateFail(serverPackets.CharacterCreateFail.reason.REASON_NAME_ALREADY_EXISTS))
      
      return;
    }

    if(this.name.length >= MAXIMUM_LENGTH_CHARACTER_NAME || !this._checkCharacterNameLetters(this.name)) {
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

    character.characterName = this.name;
    character.objectId = await database.getNextObjectId();
    character.login = player.login;
    character.maximumHp = character.hp;
    character.maximumMp = character.mp;
    character.gender = this.gender;
    character.hairStyle = this.hairStyle;
    character.hairColor = this.hairColor;
    character.face = this.face;

    await database.addCharacter(character);

    const characters = await database.getCharactersByLogin(player.login);
    
    this._client.sendPacket(new serverPackets.CharacterCreateSuccess());
    this._client.sendPacket(new serverPackets.CharacterSelectInfo(player.login, characters));
  }
}

module.exports = CharacterCreate;