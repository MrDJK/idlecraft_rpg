const areas = require("../config/skills")
const Skill = require("./Skill");
const {random} = require("lodash/number");
const items = require('../config/items');
const _ = require("lodash");
const db = require("../models")

class Adventuring extends Skill {
  constructor(socket, user, skill) {
    super(socket, user, skill);

    this.flavorText = {
      failed: [
        `You didn't find anything here`,
        `You thought you saw something, but it turns out it was turtle`,
        `You found a chest, unfortunately it was already looted`,
        `You see something move but realise it's just the wind moving some leaves`,
        `You feel sleep and need to rest`,
        `You are exhausted from exploring and need a rest`,
        `You dart away as a fire rages before your eyes`,
        `Zzzzzz`,

      ]
    }

  }

  // Action
  async tick() {
    console.log("Ticking for adventuring");
    const level = this.level = this.user.character.UserLevel[this.skill.skill + '_level'];

    const rollForLocation = Math.random();

    if(rollForLocation <= 1 / 2000) {
      await this.unlockLocation();
      return;
    }

    const {item, amount, xp} = this.getLoot();

    if(!item) {
      this.userObject.emit('adventure log', {
        created_at: new Date,
        message: this.flavorText['failed'][random(0, this.flavorText['failed'].length - 1)]
      })
    } else {

      await this.userObject.giveItem(item, amount)

      this.user.character.UserLevel[this.skill.skill + '_xp'] += xp

      await this.user.character.UserLevel.save();

      if (level < this.user.character.UserLevel[this.skill.skill + '_level']) {
        this.userObject.emit("level up", {
          skillName: this.skill.skill,
          level: this.user.character.UserLevel[this.skill.skill + '_level']
        })
      }

      this.userObject.emit("gain xp", {
        skill: this.skill.id,
        skillName: this.skill.skill,
        xp: xp
      });

      this.userObject.emit('adventure log', {
        created_at: new Date,
        message: `You found ${amount} ${item.name}`,
        items: [item, amount]
      })
    }
  }

  getLoot() {
    const chance = random(0, 100);

    if(chance > 95)
      return this.getGreatItem();
    else if(chance > 80)
      return this.getGoodItem();
    else if(chance > 30)
      return this.getRandomTrashItem()
    else
      return {};
  }

  getRandomTrashItem() {
    const i = [
      items.COBBLESTONE,
      items.STICK,
    ]

    const rand = random(0, i.length - 1);

    const amount = random(1, 2);

    console.log("picking trash item", rand, i[rand])

    return {item: i[rand], amount, xp: 15}
  }

  getGoodItem() {
    const i = [
      items.COAL,
      items.IRON_ORE,
      items.GOLD_ORE,
      items.OAK_LOG
    ];

    const rand = random(0, i.length - 1)

    const amount = random(2, 4);

    console.log("picking good item", rand, i[rand])

    return {item: i[rand], amount, xp: 40}
  }

  getGreatItem() {
    const i = [
      items.COAL,
      items.IRON_ORE,
      items.GOLD_ORE,
      items.OAK_LOG,
      items.IRON_INGOT,
      items.GOLD_INGOT
    ];

    const rand = random(0, i.length - 1)

    const amount = random(2, 4);

    console.log("picking great item", rand, i[rand])

    return {item: i[rand], amount, xp: 100}
  }

  async unlockLocation() {
    console.log("User found a new location");

    // Finding a location gives 100 actions on it
    let ticks = 100;

    const possibleLocations = areas.filter(s => s.discoverable);

    const randomLocation = possibleLocations[random(0, possibleLocations.length - 1)];
    // Check if the user already has it unlocked
    const currentlyUnlocked = this.userObject.user.Character.UnlockedLocations.find(l => {
      console.log(l.location, randomLocation.id);
      return l.location === randomLocation.id
    })

    console.log({currentlyUnlocked})

    // If it is unlocked, update it and send to client
    if(currentlyUnlocked)
    {
      console.log("User already has location so updating")
      currentlyUnlocked.ticks += ticks;
      currentlyUnlocked.save();
      this.userObject.emit('update found locations', currentlyUnlocked)
    } else {
      console.log("User hasn't found location yet so creating")
      console.log(randomLocation)

      const location = await db.UnlockedLocations.create({
        user_id: this.user.id,
        location: randomLocation.id,
        ticks: ticks
      });

      this.userObject.user.Character.UnlockedLocations.push(location);

      randomLocation.ticks = ticks;
      randomLocation.discovered = true;

      this.userObject.emit('create found locations', randomLocation)
    }


    this.user.character.UserLevel[this.skill.skill + '_xp'] += 1000;

    await this.user.character.UserLevel.save();

    if (this.level < this.user.character.UserLevel[this.skill.skill + '_level']) {
      this.userObject.emit("level up", {
        skillName: this.skill.skill,
        level: this.user.character.UserLevel[this.skill.skill + '_level']
      })
    }

    this.userObject.emit("gain xp", {
      skill: this.skill.id,
      skillName: this.skill.skill,
      xp: 1000
    });

    this.userObject.emit('adventure log', {
      created_at: new Date,
      message: `You discovered a hidden ${randomLocation.name}`,
    })


    this.userObject.emit('global toast', {
      message: `You have discovered <b>${randomLocation.name}</b>`
    })
  }
}

module.exports = Adventuring
