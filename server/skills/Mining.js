const areas = require("../config/skills")
const Skill = require("./Skill");

class Mining extends Skill {
  constructor(socket, user, skill) {
    super(socket, user, skill);
  }

  // Action
  async tick() {

    await this.rollForLoot();
  }
}

module.exports = Mining
