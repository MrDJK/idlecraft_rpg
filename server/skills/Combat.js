const {v4: uuid} = require("uuid")
const monsterList = require('../config/monsterList')
const {random} = require("lodash/number");
const {omit} = require("lodash/object");

class Combat {
  constructor(skill, io) {
    this.players = [];
    this.skill = skill;
    this.enemies = skill.monsters;
    this.roomName = null;
    this.io = io;
    this.baseEnemies = [];

    this.config = {
      basePlayerDamage: 1,
      baseEnemyDamage: 0,
    }

    this.generateRoomName();
  }

  setPlayer(player) {
    console.log('-------')
    console.log('-------')
    console.log('-------')
    console.log('-------')
    console.log('-------')
    console.log('-------')
    console.log('-------')
    console.log('-------')
    console.log('-------')
    // console.log({player})
    const f = this.players.find(p => p.user.character.username === player.user.character.username)

    if (!f)
      this.players.push(player);
    else {

      f.socket = player.socket;
      f.socket.join(this.getRoomName());
      this.enterCombat()
    }
  }

  setEnemy(enemies) {
    this.baseEnemies = JSON.parse(JSON.stringify(enemies));

    console.log("setEnemey()", enemies)

    let monsterPool = [];

    for(let i=0;i<(this.skill.max || 1);i++)
      monsterPool.push(this.baseEnemies[random(0, this.baseEnemies.length - 1)])


    console.log("monster pool", monsterPool)
    this.enemies = JSON.parse(JSON.stringify(monsterPool));
  }

  startFight() {

    this.setupPlayers();
    this.setupEnemy();
    this.enterCombat();
    this.emitToPlayers('change stage', 'fighting')
    setTimeout(() => this.startTimers(), 500)

  }

  reconnect(socket) {

    console.log('reconnect into combat');

    const check = {
      friendlyTeam: this.players.map(p => this.getPlayerProfile(p)),
      enemyTeam: this.enemies.map(m => this.getEnemyProfile(m)),
    };
    socket.emit("enter combat", check)
    socket.emit("start skill", {
      timer: -1,
      id: this.skill.id,
    })
  }

  enterCombat() {

    const check = {
      friendlyTeam: this.players.map(p => this.getPlayerProfile(p)),
      enemyTeam: this.enemies.map(m => this.getEnemyProfile(m)),
    };

    this.emitToPlayers("enter combat", check)
  }

  setupPlayers() {
    for (const player in this.players) {
      const p = this.players[player];

      const aps = this.calculateAPS(p);

      if (p.socket)
        p.socket.join(this.getRoomName());
    }
  }

  startTimers() {

    for (const player in this.players) {
      const p = this.players[player];

      const aps = this.calculateAPS(p);

      this.emitToPlayers("start combat timer", {
        id: `player-combat-${p.user.username}`,
        timer: aps
      });

      p.timers = {
        attack: setTimeout(() => {
          this.attackAsPlayer(p);
        }, aps),
        eat: setTimeout(() => {
          this.eatAsPlayer(p);
        }, 1000)
      }
    }


    for (let i = 0; i < this.enemies.length; i++) {
      const mob = this.enemies[i];

      const aps = mob.monster.stats.attacks[0].physical.speed

      this.emitToPlayers("start combat timer", {
        id: `monster-combat-${mob.id}`,
        timer: aps
      });

      console.log('setting enemy timer for ', aps)

      mob.timers = {
        attack: setTimeout(() => {
          this.attackAsEnemy(mob);
        }, aps)
      }
    }
  }

  setupEnemy() {
    for (let i = 0; i < this.enemies.length; i++) {
      const p = this.enemies[i];
      console.log(p, this.enemies)

      p.id = i;
    }
  }

  refreshFight() {
    console.log('refreshing fight')
    console.log(this.baseEnemies);

    this.setEnemy(this.baseEnemies);

    this.emitToPlayers("refresh fight")
    this.emitToPlayers("change stage", 'waiting for fight')

    this.refreshTimer = setTimeout(() => this.startFight(), 3000)
  }

  async eatAsPlayer(p) {
    clearTimeout(p.timers.eat)

    const food = p.user.inventory.find(f => f.combat_inventory && f.Item.health_given);

    if(!food)
      return;

    const currentHealth = p.user.character.health;
    const maxHealth = p.user.character.max_health;

    if(maxHealth - currentHealth >= food.Item.health_given)
    {
      console.log("Eating food", p)
      await p.consumeCombatInventoryItem(food.id)
    }

    p.timers.eat = setTimeout(() => this.eatAsPlayer(p), 1000)
  }

  attackAsPlayer(p) {
    const entity = p;

    const aps = this.calculateAPS(p);

    // get first monster
    const monster = this.enemies.find(mob => mob.monster.stats.health > 0);

    // If no monster then restart the fight
    if (!monster) {
      this.emitToPlayers("combat finished", {
        outcome: "win",
        reward: []
      })
      this.refreshFight();

      return;
    }

    const playerDamage = this.calculateDamage(p, monster);
    const actualDamage = random(1, playerDamage);

    if(this.evades()) {
      this.emitToPlayers("player attack", {
        player: p.name,
        damage: 0,
        enemy: this.getEnemyProfile(monster),
        type: 'miss'
      });
    } else {
      monster.monster.stats.health -= actualDamage;

      this.emitToPlayers("player attack", {
        player: p.name,
        damage: actualDamage,
        enemy: this.getEnemyProfile(monster)
      });
    }


    this.emitToPlayers("start combat timer", {
      id: `player-combat-${p.user.username}`,
      timer: aps
    });

    if (monster.monster.stats.health <= 0) {
      console.log("Monster dead")
      this.emitToPlayers("monster dead", this.getEnemyProfile(monster));

      for (const timer in monster.timers) {
        clearTimeout(monster.timers[timer])
      }
    }

    const findMob = this.enemies.find(mob => mob.monster.stats.health > 0);

    if (findMob) {
      clearTimeout(p.timers.attack);
      p.timers.attack = setTimeout(() => {
        this.attackAsPlayer(p)
      }, aps)
    } else {
      this.emitToPlayers("combat finished")
      this.clearAllTimers()
      this.giveLoot()
      this.refreshFight()
    }
  }

  async giveLoot() {
    // For each player roll for loot
    for(const p in this.players) {
      const player = this.players[p];

      const level = player.user.character.UserLevel[this.skill.skill + '_level'];

      let lootBag = [];

      // Roll each item for loot
      for(const m in this.enemies) {
        const mob = this.enemies[m];

        for(const l in mob.monster.loot) {
          const loot = mob.monster.loot[l];
          const roll = Math.random();

          if(roll < loot.chance)
            lootBag.push(loot);
        }
      }

      let xpGain = this.skill.xp || 0;

      if (lootBag.length > 0) {
        xpGain += lootBag.reduce((acc, l) => {
          return acc + (l.xp || 0)
        }, 0);

        for (const l in lootBag) {
          console.log(lootBag[l].item);
          await player.giveItem(lootBag[l].item);
        }
      }

      player.user.character.UserLevel[this.skill.skill + '_xp'] += xpGain

      await player.user.character.UserLevel.save();

      if (level < player.user.character.UserLevel[this.skill.skill + '_level']) {
        player.user.character.max_health += 1;
        player.user.character.health += 1;
        player.user.character.save();

        player.emit("character update", {
          health: player.user.character.health,
          max_health: player.user.character.max_health
        });
        player.emit("level up", {
          skillName: this.skill.skill,
          level: player.user.character.UserLevel[this.skill.skill + '_level']
        })
      }

      player.emit("gain xp", {
        skill: this.skill.id,
        skillName: this.skill.skill,
        xp: xpGain,
        items: omit(lootBag, 'loot.chance')
      });
    }
  }

  attackAsEnemy(mob) {
    const player = this.players[Math.floor(Math.random() * this.players.length)];

    const damage = this.calculateDamage(mob, player);

    const aps = mob.monster.stats.attacks[0].physical.speed;

    const actualDamage = random(1, damage);

    if(this.evades()) {

      this.emitToPlayers("monster attack", {
        player: player.username,
        damage: 0,
        enemy: this.getPlayerProfile(player),
        type: 'miss'
      });
    } else {
      player.user.character.health -= actualDamage;

      this.emitToPlayers("monster attack", {
        player: player.username,
        damage: actualDamage,
        enemy: this.getPlayerProfile(player)
      });

      if(player.user.character.health <= 0) {
        player.user.character.health = 0;
      }

      player.emit("character update", {
        health: player.user.character.health
      });


      player.user.character.save();
    }


    if(player.user.character.health === 0) {
      this.killPlayer(player);
      this.endFight();
      return;
    }

    this.emitToPlayers("start combat timer", {
      id: `monster-combat-${mob.id}`,
      timer: aps
    });

    clearTimeout(mob.timers.attack);

    mob.timers.attack = setTimeout(() => {
      this.attackAsEnemy(mob)
    }, aps)
  }

  killPlayer(player) {
    player.socket.emit("global toast", {
      message: "You died :("
    });

    player.socket.emit("dead");

    const findMob = this.players.find(p => p.user.character.health > 0);

    if (!findMob) {
      this.clearAllTimers()
      player.stopSkill();
    }
  }

  getEnemyProfile(enemy) {
    return {
      id: enemy.id,
      name: enemy.name,
      health: enemy.monster.stats.health,
      max_health: enemy.monster.stats.max_health,
      monster: enemy.monster
    }
  }

  getPlayerProfile(player) {
    return {
      name: player.user.username,
      character: {
        id: player.user.character.id,
        health: player.user.character.health,
        max_health: player.user.character.max_health,
        username: player.user.character.username,
        skin: player.user.character.skin,
        title: player.user.character.title,
        UserInventories: player.user.inventory.filter(e => e.equipped)
      }
    }
  }

  calculateDamage(playerOne, playerTwo) {
    let damage = 1;
    let damageReduction = 0;

    let isMonster = false;

    if(playerOne.monster) {
      isMonster = true;
    }


    // If attacking as monster
    if(isMonster) {
      // get monster damage
      damage = playerOne.monster.stats.attacks[0].physical.damage;

      // Get other persons equipment,
      for (const i of playerTwo.user.inventory.filter(s => s.equipped)) {
        damageReduction += i.Item.defense || 0;
      }

      if(damageReduction > 40)
        damageReduction = 40;

      damage = damage - ((damage / 100) * damageReduction)

      if(damage <= 0)
        damage = 1;

    } else {
      // If attacking as player get their damage
      for (const i of playerOne.user.inventory.filter(s => s.equipped)) {
        damage += i.Item.attack || 0;
      }

      damage = damage - ((damage / 100) * playerTwo.monster.stats.defence.physical)
    }

    return Math.floor(damage);
  }

  emitToPlayers(eventName, obj) {
    if (this.io)
      this.io.to(this.getRoomName()).emit(eventName, obj)
  }

  calculateAPS(p) {
    let timeBase = 5000;

    let enchantments = [0];

    const items = p.user.inventory.filter(s => s.equipped === true);

    const reducer = function (a, b) {
      if (typeof a === 'number') {
        return a + b.enchantment_strength
      }

      return a.enchantment_strength + b.enchantment_strength
    }

    for (const i in items) {
      const item = items[i];
      console.log("Found equipment");

      item.ItemEnchantments.every(e => {
        if (e.enchantment_name === `attackSpeed`) {
          enchantments.push(e)
        }
      });

      console.log('item speed', item.Item.speed)

      timeBase -= ((timeBase / 100) * item.Item.speed) || 0;
    }

    const speedReduction = enchantments.reduce(reducer);

    const calc = ((timeBase / 100 * (100 - speedReduction))).toFixed(2);

    console.log('setting aps', calc);

    return calc
  }

  evades() {
    return random(0, 100) < 20;
  }

  getRoomName() {
    return this.roomName || this.generateRoomName()
  }

  generateRoomName() {
    this.roomName = uuid();

    return this.roomName;
  }

  endFight() {

    console.log("Ending fight")
    this.clearAllTimers();

    this.enemies = [];
    this.players = []
  }

  clearAllTimers() {


    for (const player in this.players) {
      const p = this.players[player];

      for (const timer in p.timers) {
        console.log("Clearing timer", p.timers[timer])
        clearTimeout(p.timers[timer])
      }

      p.timers = [];
    }

    for (const mob in this.enemies) {
      const p = this.enemies[mob];

      for (const timer in p.timers) {
        console.log("Clearing timer", p.timers[timer])
        clearTimeout(p.timers[timer])
      }
    }

    clearTimeout(this.refreshTimer)
  }


}

module.exports = Combat
