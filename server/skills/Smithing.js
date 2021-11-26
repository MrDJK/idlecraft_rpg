const areas = require("../config/skills")
const Skill = require("./Skill");
const _ = require("lodash");

class Smithing extends Skill {
  constructor(socket, user, skill) {
    super(socket, user, skill);
  }

  // Action
  async tick() {
    const level = this.user.character.UserLevel[this.skill.skill + '_level'];

    const skill = this.skill;

    // Check if enough ingredients
    if (this.hasEnoughIngredients()) {
      console.log('has ingredients')
      for (const i in skill.requires) {
        const item = skill.requires[i];

        await this.userObject.takeItem(
          this.user.inventory.find(s => s.item_id === item.item.id),
          item.quantity
        );
      }

      for (const i in skill.loot) {
        const item = skill.loot[i];

        await this.userObject.giveItem(
          item.item,
          item.quantity
        )
      }

      this.user.character.UserLevel[this.skill.skill + '_xp'] += skill.xp

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
        xp: skill.xp,
        items: _.omit(skill.loot, 'loot.chance')
      });

      if(!this.hasEnoughIngredients())
      {
        this.userObject.forceStop = true;
      }


    } else {
      console.log("Don't have the ingredients");
      this.userObject.forceStop = true;
      return false;
    }
  }

  hasEnoughIngredients() {
    const skill = this.skill;


    for (const i in skill.requires) {
      const reqIngredient = skill.requires[i];
      const reqItemInv = this.user.inventory.find(s => s.item_id === reqIngredient.item.id && s.amount >= reqIngredient.quantity)

      if (!reqItemInv)
        return false;
    }

    return true;
  }
}

module.exports = Smithing
