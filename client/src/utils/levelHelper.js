const levelHelpers = {};

levelHelpers.xpTable = require('./xpTable');

// levelHelpers.buildXpTable = function (limit = 1000) {
  // for (let i = 0; i < limit; i++) {
  //   levelHelpers.xpTable.push([
  //     this.getRequiredXp(i)
  //   ]);
  // }
// }

levelHelpers.getRequiredXp = function (level) {
  return Math.ceil((100 * level) + ((level * level * 6.4) * level) * 2.2);
}

levelHelpers.getXpDifferenceForLastLevel = function (level) {
  return this.getLevelXp(level) - this.getLevelXp(level - 1);
}

levelHelpers.getXpDifferenceForNextLevel = function (level) {
  return this.getLevelXp(level + 1) - this.getLevelXp(level);
}


module.exports = {levelHelpers};
