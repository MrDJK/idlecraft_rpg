const itemList = require('../items')

const locations = [
  {
    id: 400,
    name: 'Cooked Cod',
    skill: 'cooking',
    timer: 1000,
    xp: 100,
    heat: 50,
    ingredients: [
      {
        item: itemList.RAW_COD,
        quantity: 1,
      }
    ],
    outcome: itemList.COOKED_COD
  },
  {
    id: 401,
    name: 'Cooked Salmon',
    skill: 'cooking',
    timer: 10000,
    xp: 100,
    heat: 50,
    ingredients: [
      {
        item: itemList.RAW_SALMON,
        quantity: 1,
      }
    ],
    outcome: itemList.COOKED_SALMON,
  },
  {
    id: 403,
    name: 'Chicken',
    skill: 'cooking',
    timer: 15000,
    xp: 150,
    heat: 100,
    ingredients: [
      {
        item: itemList.RAW_CHICKEN,
        quantity: 1
      }
    ],
    outcome: itemList.COOKED_CHICKEN
  }
]

module.exports = locations;
