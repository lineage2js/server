const EventEmitter = require('events');
const database = require('./../../Database');
const Bot = require('./../Models/Bot');

class BotsManager extends EventEmitter {
  constructor() {
    super();

    this._bots = [];
  }

  async enable() {
    for(let i = 0; i < 1; i++) {
      const bot = new Bot({
        sendPacket() {}
      });
  
      bot.update({
        objectId: await database.getNextObjectId(),
        login: "a",
        characterName: "test" + i,
        title: "bot",
        level: 1,
        gender: 0,
        hairStyle: 0,
        hairColor: 0,
        face: 0,
        heading: 0,
        accessLevel: 0,
        onlineTime: 0,
        clanId: 0,
        clanLeader: 0,
        clanCrestId: 0,
        allianceId: 0,
        allianceCrestId: 0,
        gm: 0,
        privateStoreType: 0,
        exp: 0,
        sp: 0,
        pvp: 0,
        pk: 0,
        karma: 0,
        classId: 0,
        className: "Human Fighter",
        raceId: 0,
        str: 40,
        dex: 30,
        con: 43,
        int: 21,
        wit: 11,
        men: 25,
        hp: 126,
        maximumHp: 126,
        mp: 38,
        maximumMp: 38,
        pAtk: 4,
        pDef: 72,
        mAtk: 3,
        mDef: 47,
        pSpd: 330,
        mSpd: 213,
        accuracy: 33,
        critical: 44,
        evasion: 33,
        baseRunSpeed: 115,
        baseWalkSpeed: 80,
        swimSpeed: null,
        maximumLoad: 81900,
        x: -72222,
        y: 257258,
        z: -3115,
        canCraft: 0,
        maleAttackSpeedMultiplier: 1.188,
        maleCollisionRadius: 9,
        maleCollisionHeight: 23,
        femaleAttackSpeedMultiplier: 1.188,
        femaleCollisionRadius: "8",
        femaleCollisionHeight: "23.5",
      });
  
      bot.on('move', () => {
        this.emit('move', bot);
      });
  
      bot.on('attack', () => {
        this.emit('attack', bot);
      });
  
      bot.on('pickup', (item) => {
        this.emit('pickup', bot, item);
      });
  
      bot.enable();
  
      this._bots.push(bot);
  
      this.emit('spawn', bot);
    }
  }
}

module.exports = new BotsManager();