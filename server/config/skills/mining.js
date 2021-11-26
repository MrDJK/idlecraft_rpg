const itemList = require('../items')

const locations = [
//mining default locations
  {
    id: 100,
    name: 'Stone Age',
    timer: 5000,
    skill: 'mining',
    xp: 10,
    discovered: true,
    image: 'skill_locations/stone_age',
    loot: [
      {
        item: itemList.COBBLESTONE,
        chance: 1 / 10,
        xp: 5,
      },
      {
        item: itemList.GRAVEL,
        chance: 1 / 5,
        xp: 10,
      },
      {
        item: itemList.COAL,
        chance: 1 / 10,
        xp: 15,
      },
    ]
  },
  {
    id: 101,
    name: 'Deserted Mines',
    timer: 10000,
    skill: 'mining',
    xp: 5,
    discovered: true,
    image: 'skill_locations/deserted_mineshaft',
    loot: [
      {
        item: itemList.COBBLESTONE,
        chance: 1 / 10,
        xp: 5,
      },
      {
        item: itemList.COAL,
        chance: 1 / 3,
        xp: 15,
      },
    ]
  },
  {
    id: 103,
    name: 'Ravine',
    timer: 15000,
    skill: 'mining',
    discovered: true,
    xp: 5,
    image: 'skill_locations/ravine',
    level: 10,
    loot: [
      {
        item: itemList.COAL,
        chance: 1 / 5,
        xp: 15,
      },
      {
        item: itemList.IRON_ORE,
        chance: 1 / 10,
        xp: 25,
      },
      {
        item: itemList.GOLD_ORE,
        chance: 1 / 17,
        xp: 40,
      },
    ]
  },

  {
    id: 104,
    name: 'Cave',
    timer: 20000,
    skill: 'mining',
    discovered: true,
    xp: 5,
    image: 'skill_locations/cave',
    level: 25,
    loot: [
      {
        item: itemList.COBBLESTONE,
        chance: 1 / 4,
        xp: 5,
      },
      {
        item: itemList.GOLD_ORE,
        chance: 1 / 20,
        xp: 40,
      },
      {
        item: itemList.REDSTONE_ORE,
        chance: 1 / 30,
        xp: 80,
      },
    ]
  },

  {
    id: 105,
    name: 'Cavern',
    timer: 40000,
    skill: 'mining',
    discovered: true,
    xp: 5,
    image: 'skill_locations/cavern',
    level: 50,
    loot: [
      {
        item: itemList.COBBLESTONE,
        chance: 1 / 4,
        xp: 5,
      },
      {
        item: itemList.EMERALD_ORE,
        chance: 1 / 15,
        xp: 30,
      },
      {
        item: itemList.LAPIS_LAZULI_ORE,
        chance: 1 / 30,
        xp: 80,
      },
    ]
  },

  {
    id: 106,
    name: 'Volcanic Mine',
    timer: 60000,
    skill: 'mining',
    discovered: true,
    xp: 5,
    image: 'skill_locations/volcanic_mine',
    level: 90,
    loot: [
      {
        item: itemList.COBBLESTONE,
        chance: 1 / 4,
        xp: 10,
      },
      {
        item: itemList.DIAMOND_ORE,
        chance: 1 / 50,
        xp: 150,
      },
      {
        item: itemList.OBSIDIAN,
        chance: 1 / 100,
        xp: 100,
      },
    ]
  },

//hidden mining locations

  {
    id: 107,
    name: 'Mineshaft',
    timer: 60000,
    skill: 'mining',
    discovered: false,
    discoverable: true,
    xp: 25,
    image: 'skill_locations/the_mineshaft',
    loot: [
      {
        item: itemList.EMERALD_ORE,
        chance: 1 / 5,
        xp: 15,
      },
      {
        item: itemList.DIAMOND_ORE,
        chance: 1 / 10,
        xp: 100,
      },
      {
        item: itemList.ENCHANTED_GOLDEN_APPLE,
        chance: 1 / 1000,
        xp: 2000,
      },
    ]
  },

  {
    id: 108,
    name: 'Void',
    timer: 60000,
    skill: 'mining',
    discovered: false,
    discoverable: true,
    xp: 25,
    image: 'skill_locations/void_1',
    loot: [
      {
        item: itemList.OBSIDIAN,
        chance: 1 / 7,
        xp: 100,
      },
      {
        item: itemList.PHANTOM_MEMBRANE,
        chance: 1 / 100,
        xp: 20,
      },
      {
        item: itemList.SPECTRAL_ARROW,
        chance: 1 / 150,
        xp: 1500,
      },
    ]
  },
]

module.exports = locations
