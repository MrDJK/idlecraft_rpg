const itemList = require('./items')

const monsterList = {
  CREEPER: {
    render: {
      texture: 'creeper/creeper',
      model: 'creeper'
    },
    stats: {
      health: 10,
      max_health: 10,
      attacks: [
        {
          physical: {
            speed: 3500,
            damage: 2
          }
        }
      ],
      defence: {
        magic: 50,
        physical: 50,
        range: 50,
      },
    },
    xp: 10,
    loot: [
      {
        item: itemList.GUNPOWDER,
        chance: 1,
        xp: 5
      }
    ]
  },
  ENDER_DRAGON: {
    render: {
      texture: 'enderdragon/dragon',
      model: 'dragon'
    }
  },
  CHICKEN: {
    render: {
      model: 'chicken'
    },
    stats: {
      health: 5,
      max_health: 5,
      attacks: [
        {
          physical: {
            speed: 4000,
            damage: 1
          }
        }
      ],
      defence: {
        physical: 5,
      },
    },
    xp: 1000,
    loot: [
      {
        item: itemList.FEATHER,
        chance: 1,
        xp: 5
      },
      {
        item: itemList.RAW_CHICKEN,
        chance: 1 / 3,
        xp: 10
      },
    ]
  },
  ZOMBIE: {
    render: {
      model: 'zombie'
    }
  },
  EMPOWERED_CREEPER: {
    render: {
      model: 'empowered_creeper'
    }
  },
  COW: {
    render: {
      model: 'cow'
    },

    stats: {
      health: 10,
      max_health: 10,
      attacks: [
        {
          physical: {
            speed: 4000,
            damage: 1
          }
        }
      ],
      defence: {
        physical: 10,
      },
    },
    xp: 1000,
    loot: [
      {
        item: itemList.FEATHER,
        chance: 1,
        xp: 5
      },
      {
        item: itemList.RAW_CHICKEN,
        chance: 1 / 3,
        xp: 10
      },
    ]
  },
  SHEEP: {
    render: {
      model: 'zombie'
    }
  },
  RABBIT: {
    render: {
      model: 'zombie'
    }
  },
  PIG: {
    render: {
      model: 'zombie'
    }
  },
  BAT: {
    render: {
      model: 'zombie'
    }
  }
}

module.exports = monsterList
