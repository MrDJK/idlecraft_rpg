const itemList = require('../items')
const monsterList = require('../monsterList')

const locations = [

  {
    id: 1000,
    name: "The Farm",
    skill: 'combat',
    discovered: true,
    max: 1,
    xp: 20,
    monsters: [
      {
        name: "Cow",
        monster: monsterList.COW,
        chance: 1 / 2
      },
      {
        name: "Chicken",
        monster: monsterList.CHICKEN,
        chance: 1 / 2
      },
    ]
  }
]

module.exports = locations;
