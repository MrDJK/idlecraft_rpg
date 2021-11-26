export class LootTumbler {
  constructor(loot) {
   this.roll = null;
   this.loot = loot;
  }

  roll() {
    this.roll = Math.random();
  }
}
