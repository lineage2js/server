const serverPackets = require('./../ServerPackets/serverPackets');
const ClientPacket = require("./ClientPacket");
const Character = require('./../Models/Character');
const database = require('./../../Database');
const characterTemplates = require('./../data/characterTemplates.json');
const playersManager = require('./../Managers/PlayersManager');
const itemsManager = require('./../Managers/ItemsManager');

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

  async checkAvailableNumberCharacters(login) {
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
    const player = playersManager.getPlayerByClient(this._client);
    const isManyCharacters = await this.checkAvailableNumberCharacters(player.login);
    
    // check how many characters are on the account
    if (isManyCharacters) {
      this._client.sendPacket(new serverPackets.CharacterCreateFail(serverPackets.CharacterCreateFail.reason.REASON_TOO_MANY_CHARACTERS))
      
      return;
    }

    // check character name for length and regular expression
    if(this.name <= 0 || this.name.length >= MAXIMUM_LENGTH_CHARACTER_NAME || !this._checkCharacterNameLetters(this.name)) {
      this._client.sendPacket(new serverPackets.CharacterCreateFail(serverPackets.CharacterCreateFail.reason.REASON_16_ENG_CHARS))

      return;
    }

    const isUsedCharacterName = await database.checkCharacterNameExists(this.name);

    // check character name for availability
    if (isUsedCharacterName) {
      this._client.sendPacket(new serverPackets.CharacterCreateFail(serverPackets.CharacterCreateFail.reason.REASON_NAME_ALREADY_EXISTS))
      
      return;
    }

    // Get character template by classId (classId is unique)
    const characterTemplate = characterTemplates.find(characterTemplate => {
      if (characterTemplate.classId === this.classId) {
        return true;
      } else {
        return false;
      }
    });

    //fix
    // create inventory
    const initialEquipment = require('./../../Data/initialEquipment.json');
    const inventory = {
      objectId: await database.getNextObjectId(), // fix
      items: []
    };

    for (let i = 0; i < initialEquipment['human_fighter'].length; i++) {
      const itemName = initialEquipment['human_fighter'][i];
      const item = await itemsManager.createItemByName(itemName);

      inventory.items.push(item);
    }

    await database.addInventory(inventory);
    //

    // create character
    const character = Character.create(characterTemplate);

    character.characterName = this.name;
    character.gender = this.gender;
    character.objectId = await database.getNextObjectId();
    character.login = player.login;
    character.maximumHp = character.hp;
    character.maximumMp = character.mp;
    character.hairStyle = this.hairStyle;
    character.hairColor = this.hairColor;
    character.face = this.face;
    character.inventoryId = inventory.objectId;

    // add character to database
    await database.addCharacter(character);

    // get all characters on user account
    const characters = await database.getCharactersByLogin(player.login);
    
    this._client.sendPacket(new serverPackets.CharacterCreateSuccess());
    this._client.sendPacket(new serverPackets.CharacterSelectInfo(player.login, characters));
  }
}

module.exports = CharacterCreate;