const itemList = require('../items')

const locations = [

  {
    id: 1,
    name: 'Woodland',
    timer: 5000,
    skill: 'woodcutting',
    discovered: true,
    xp: 5,
    image: 'skill_locations/woodlands',
    loot: [
      {
        item: itemList.STICK,
        chance: 1 / 3,
        xp: 5,
      },
      {
        item: itemList.OAK_LOG,
        chance: 1 / 4,
        xp: 7,
      },
    ]
  },
  {
    id: 2,
    name: 'Lumberjack Cottage',
    timer: 10000,
    skill: 'woodcutting',
    discovered: true,
    xp: 5,
    image: 'skill_locations/lumberjack_cottage',
    loot: [
      {
        item: itemList.STICK,
        chance: 1 / 4,
        xp: 5,
      },
      {
        item: itemList.BIRCH_LOG,
        chance: 1 / 2,
        xp: 15,
      }
    ]
  },
//woodcutting default locations
  {
    id: 3,
    name: 'Savanna',
    timer: 15000,
    skill: 'woodcutting',
    discovered: true,
    xp: 5,
    image: 'skill_locations/savanna',
    level: 10,
    loot: [
      {
        item: itemList.STICK,
        chance: 1 / 4,
        xp: 5,
      },
      {
        item: itemList.ORANGE_TERRACOTTA,
        chance: 1 / 15,
        xp: 20,
      },
      {
        item: itemList.ACACIA_LOG,
        chance: 1 / 4,
        xp: 25,
      },
    ]
  },

  {
    id: 4,
    name: 'Snowy Tundra',
    timer: 20000,
    skill: 'woodcutting',
    discovered: true,
    xp: 5,
    image: 'skill_locations/snowy_tundra',
    level: 25,
    loot: [
      {
        item: itemList.STICK,
        chance: 1 / 4,
        xp: 1,
      },
      {
        item: itemList.SNOWBALL,
        chance: 1 / 20,
        xp: 50,
      },
      {
        item: itemList.SPRUCE_LOG,
        chance: 1 / 4,
        xp: 25,
      },
    ]
  },

  {
    id: 5,
    name: 'Jungle',
    timer: 4000,
    skill: 'woodcutting',
    discovered: true,
    xp: 5,
    image: 'skill_locations/jungle',
    level: 50,
    loot: [
      {
        item: itemList.STICK,
        chance: 1 / 2,
        xp: 1,
      },
      {
        item: itemList.COCOA_BEANS,
        chance: 1 / 25,
        xp: 50,
      },
      {
        item: itemList.JUNGLE_LOG,
        chance: 1 / 4,
        xp: 25,
      },
    ]
  },

  {
    id: 6,
    name: 'Deep Woods',
    timer: 60000,
    skill: 'woodcutting',
    discovered: true,
    xp: 5,
    image: 'skill_locations/dark_forest',
    level: 90,
    loot: [
      {
        item: itemList.STICK,
        chance: 1 / 3,
        xp: 1,
      },
      {
        item: itemList.VINES,
        chance: 1 / 30,
        xp: 60,
      },
      {
        item: itemList.DARK_OAK_LOG,
        chance: 1 / 4,
        xp: 25,
      },
    ]
  },
//woodcutting hidden locations
  {
    id: 7,
    name: 'Forbidden Forest',
    timer: 60000,
    skill: 'woodcutting',
    discovered: false,
    discoverable: true,
    xp: 25,
    image: 'skill_locations/forbidden_forest',
    loot: [
      {
        item: itemList.TOTEM_OF_UNDYING,
        chance: 1 / 10000,
        xp: 20,
      },
      {
        item: itemList.FLOWERING_AZALEA_LEAVES,
        chance: 1 / 35,
        xp: 100,
      },
      {
        item: itemList.OAK_LOG,
        chance: 1 / 4,
        xp: 20,
      },
    ]
  },

  {
    id: 8,
    name: 'Magical Forest',
    timer: 60000,
    skill: 'woodcutting',
    discovered: false,
    discoverable: true,
    xp: 25,
    image: 'skill_locations/a_magical_forest',
    loot: [
      {
        item: itemList.CANDLE,
        chance: 1 / 400,
        xp: 100,
      },
      {
        item: itemList.LIGHTNING_ROD,
        chance: 1 / 5000,
        xp: 100,
      },
      {
        item: itemList.OAK_LOG,
        chance: 1 / 4,
        xp: 7,
      },
    ]
  },

]

module.exports = locations;
