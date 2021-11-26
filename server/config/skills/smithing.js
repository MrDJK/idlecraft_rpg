const itemList = require('../items')

const locations = [
  {
    id: 300,
    name: 'Smelt Stone',
    timer: 2000,
    skill: 'smithing',
    xp: 5,
    discovered: true,
    loot: [
      {
        item: itemList.STONE,
        quantity: 1,
      }
    ],
    requires: [
      {
        item: itemList.COBBLESTONE,
        quantity: 2,
      },
      {
        item: itemList.COAL,
        quantity: 1,
      },
    ]
  },
  {
    id: 301,
    name: 'Smelt Iron',
    timer: 2000,
    skill: 'smithing',
    xp: 5,
    discovered: true,
    loot: [
      {
        item: itemList.IRON_INGOT,
        quantity: 1,
      }
    ],
    requires: [
      {
        item: itemList.IRON_ORE,
        quantity: 10,
      },
      {
        item: itemList.COAL,
        quantity: 5,
      },
    ]
  },
  {
    id: 302,
    name: 'Smelt Gold',
    timer: 2000,
    skill: 'smithing',
    xp: 10,
    discovered: true,
    loot: [
      {
        item: itemList.GOLD_INGOT
      }
    ],
    requires: [
      {
        item: itemList.GOLD_ORE,
        quantity: 20,
      },
      {
        item: itemList.COAL,
        quantity: 10,
      },
    ]
  },
  {
    id: 303,
    name: 'Smelt Diamonds',
    timer: 2000,
    skill: 'smithing',
    xp: 10,
    discovered: true,
    loot: [
      {
        item: itemList.DIAMOND
      }
    ],
    requires: [
      {
        item: itemList.DIAMOND_ORE,
        quantity: 50,
      },
      {
        item: itemList.COAL,
        quantity: 50,
      },
    ]
  },
]

module.exports = locations;
