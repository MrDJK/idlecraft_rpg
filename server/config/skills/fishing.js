const itemList = require('../items')

const locations = [
  {
    id: 200,
    name: 'Puddle',
    timer: 10000,
    skill: 'fishing',
    xp: 15,
    discovered: true,
    image: 'skill_locations/puddle',
    loot: [
      {
        item: itemList.RAW_COD,
        chance: 1 / 2,
        xp: 30,
      },
      {
        item: itemList.TROPICAL_FISH,
        chance: 1 / 20,
        xp: 30,
      },
      {
        item: itemList.TROPICAL_FISH_SPAWN_EGG,
        chance: 1 / 1000,
        xp: 2500,
      }
    ]
  },
  {
    id: 201,
    name: 'Lagoon',
    timer: 20000,
    skill: 'fishing',
    discovered: true,
    xp: 25,
    image: 'skill_locations/blue_lagoon',
    level: 20,
    loot: [
      {
        item: itemList.INK_SAC,
        chance: 1 / 15,
        xp: 4,
      },
      {
        item: itemList.NAUTILUS_SHELL,
        chance: 1 / 15,
        xp: 20,
      },
      {
        item: itemList.RAW_FISH,
        chance: 1 / 3,
        xp: 5,
      },
    ]
  },
  {
    id: 202,
    name: 'Coral Reef',
    timer: 30000,
    skill: 'fishing',
    discovered: true,
    xp: 35,
    image: 'skill_locations/coral_reef',
    level: 60,
    loot: [
      {
        item: itemList.BUBBLE_CORAL,
        chance: 1 / 10,
        xp: 4,
      },
      {
        item: itemList.SEA_PICKLE,
        chance: 1 / 20,
        xp: 50,
      },
      {
        item: itemList.FIRE_CORAL,
        chance: 1 / 15,
        xp: 20,
      },
    ]
  },
  {
    id: 203,
    name: 'Deep Sea',
    timer: 45000,
    skill: 'fishing',
    discovered: true,
    xp: 55,
    image: 'skill_locations/deep_sea',
    level: 90,
    loot: [
      {
        item: itemList.PUFFERFISH,
        chance: 1 / 15,
        xp: 4,
      },
      {
        item: itemList.SCUTE,
        chance: 1 / 20,
        xp: 50,
      },
      {
        item: itemList.SPONGE,
        chance: 1 / 15,
        xp: 20,
      },
    ]
  },

//hidden fishing locations

  {
    id: 204,
    name: 'Troubled Waters',
    timer: 60000,
    skill: 'fishing',
    discovered: false,
    discoverable: true,
    xp: 100,
    image: 'skill_locations/troubled_waters',
    loot: [
      {
        item: itemList.HEART_OF_THE_SEA,
        chance: 1 / 30,
        xp: 30,
      },
      {
        item: itemList.TRIDENT,
        chance: 1 / 100000,
        xp: 10000,
      },
      {
        item: itemList.PRISMARINE_SHARD,
        chance: 1 / 1000,
        xp: 1000,
      },
    ]
  },

]

module.exports = locations;
