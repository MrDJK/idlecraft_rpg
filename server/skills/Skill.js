const areas = require("../config/skills");
const {omit} = require("lodash/object");

class Skill {
  constructor(socket, user, skill) {
    this.areas = areas;
    this.socket = socket;
    this.user = user.user;
    this.userObject = user;
    this.skill = skill;
  }

  getSkill() {
    return this.areas[this.skill.id]
  }

  async rollForLoot(possibleLoot = null) {

    const level = this.user.character.UserLevel[this.skill.skill + '_level'];

    let loot = [];

    if (!possibleLoot)
      possibleLoot = this.skill.loot

    for (const l in this.skill.loot) {
      const rollForLoot = this.skill.loot[l];

      const roll = this.roll();
      if (rollForLoot.chance > roll) {
        loot.push(rollForLoot);
      }
    }

    let xpGain = this.skill.xp || 0;

    if (loot.length > 0) {
      xpGain += loot.reduce((acc, l) => {
        return acc + (l.xp || 0)
      }, 0);

      for (const l in loot) {
        await this.userObject.giveItem(loot[l].item);
      }
    }

    this.user.character.UserLevel[this.skill.skill + '_xp'] += xpGain

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
      xp: xpGain,
      items: omit(loot, 'loot.chance')
    });

    console.log(this.skill)

    if (this.skill.discoverable) {
      const currentlyUnlocked = this.userObject.user.unlocked_locations.find(l => {
        return l.location === this.skill.id
      })

      currentlyUnlocked.ticks--;

      currentlyUnlocked.save();


      this.userObject.emit("update found locations", currentlyUnlocked);

      if(currentlyUnlocked.ticks <= 0)
      {
        this.userObject.forceStop = true;
        currentlyUnlocked.destroy();

        this.userObject.emit("remove found locations", currentlyUnlocked)
      }
    }

    return loot;
  }

  roll() {
    return Math.random();
  }

  async checks() {
    return true;
  }
}

module.exports = Skill;
