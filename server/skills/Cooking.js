const areas = require("../config/skills")
const Skill = require("./Skill");
const _ = require("lodash");

class Cooking extends Skill {
  constructor(socket, user, skill) {
    super(socket, user, skill);
  }

  async checks() {

    const hE = this.hasEnoughIngredients();
    const heat = this.user.character.heat;

    console.log("has enough ingredients")

    if (heat < this.skill.heat)
      this.userObject.sendToast({
        message: `You don't have enough heat for that, consume coal or other fuel sources to gain heat`
      });
    else if (!hE)
      this.userObject.sendToast({
        message: `You don't have enough ingredients for that`
      });

    return hE;
  }

  // Action
  async tick() {

    const level = this.user.character.UserLevel[this.skill.skill + '_level'];

    const skill = this.skill;

    // Check if enough ingredients
    if (this.hasEnoughIngredients()) {
      console.log('has ingredients')
      for (const i in skill.ingredients) {
        const item = skill.ingredients[i];

        console.log('skill requires', item)

        await this.userObject.takeItem(
          this.user.inventory.find(s => s.item_id === item.item.id),
          (item.quantity || 1)
        );
      }

      this.user.character.heat -= skill.heat;
      this.user.character.save();

      this.userObject.emit("character update", {
        heat: this.user.character.heat
      })

      await this.userObject.giveItem(
        skill.outcome,
        1
      )

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
        items: [skill.outcome]
      });

      if (!this.hasEnoughIngredients()) {
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

    const heat = this.user.character.heat;

    console.log("has enough ingredients")

    if (heat < this.skill.heat)
      return false;

    for (const i in skill.ingredients) {
      const reqIngredient = skill.ingredients[i];
      const reqItemInv = this.user.inventory.find(s => s.item_id === reqIngredient.item.id && s.amount >= (reqIngredient.quantity || 1))

      if (!reqItemInv)
        return false;
    }

    return true;
  }
}

module.exports = Cooking
