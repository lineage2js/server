const DefaultNpc = require('./DefaultNpc');

const sellList0 = [
  {"small_sword": 15},
  {"club": 15},
  {"bone_dagger": 15},
  {"short_bow": 15},
  {"broad_sword": 15},
  {"heavy_chisel": 15},
  {"knife": 15},
  {"doomed_dagger": 15},
  {"bow": 15},
  {"mace": 15},
  {"sickle": 15},
  {"brandish": 15},
  {"gladius": 15},
  {"orcish_sword": 15},
  {"handmade_sword": 15},
  {"dwarven_mace": 15},
  {"dirk": 15},
  {"hunting_bow": 15},
  {"long_sword": 15},
  {"throw_knife": 15},
  {"bow_of_forest": 15},
  {"short_spear": 15},
  {"pants": 15},
  {"shirt": 15},
  {"leather_pants": 15},
  {"leather_shirt": 15},
  {"hard_leather_pants": 15},
  {"wooden_gaiters": 15},
  {"wooden_breastplate": 15},
  {"tights_pants": 15},
  {"tights_shirt": 15},
  {"bone_breastplate": 15},
  {"bone_gaiters": 15},
  {"leather_shield": 15},
  {"small_shield": 15},
  {"buckler": 15},
  {"round_shield": 15},
  {"short_gloves": 15},
  {"short_leather_gloves": 15},
  {"gloves": 15},
  {"leather_gloves": 15},
  {"apprentice's_shoes": 15},
  {"cloth_shoes": 15},
  {"leather_sandals": 15},
  {"crude_leather_shoes": 15},
  {"cotton_shoes": 15},
  {"leather_shoes": 15},
  {"low_boots": 15},
  {"cloth_cap": 15},
  {"leather_cap": 15},
  {"wooden_helmet": 15},
  {"leather_helmet": 15},
  {"wooden_arrow": 15},
  {"bone_arrow": 15},
]

class Merchant extends DefaultNpc {
  onMenuSelected(talker, ask, reply) {
    if (ask === -1) {
      if (reply === 0) {
        this.sell(talker, sellList0, "", "")
      }
    }
  }
}

module.exports = Merchant;