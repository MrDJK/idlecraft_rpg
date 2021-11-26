const itemList = require('./items')
const monsterList = require('../config/monsterList')

const miningLocations = require('./skills/mining') //100
const fishingLocations = require('./skills/fishing') //200
const smithingLocations = require('./skills/smithing') //300
const woodcuttingLocations = require('./skills/woodcutting'); // 0
const combatLocations = require('./skills/combat'); // 1000
const adventuringLocations = require('./skills/adventuring') // 2000
const cookingRecipes = require('./skills/cooking') // 400

module.exports = [
  ...miningLocations,
  ...fishingLocations,
  ...smithingLocations,
  ...woodcuttingLocations,
  ...combatLocations,
  ...adventuringLocations,
  ...cookingRecipes
]
