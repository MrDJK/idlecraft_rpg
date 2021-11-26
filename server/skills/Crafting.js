const Skill = require("./Skill");
const recipes = require('../config/recipes')
const {groupBy} = require("lodash/collection");

class Crafting extends Skill {
  constructor(socket, user, skill = null) {
    super(socket, user, skill);
  }

  setCraftingTable(table) {
    this.craftingTable = table;
  }

  async tick() {
    this.recipe = await this.findRecipe()

    if (this.recipe && this.hasItemsForRecipe()) {
      console.log("has item to craft")
      await this.craftItem();
    } else {

      if(this.recipe && !this.hasItemsForRecipe()) {

        this.userObject.sendToast({
          message: `You don't have the materials for this`
        })
        return;
      }

      if (!this.recipe)
        this.userObject.sendToast({
          message: 'Recipe doesn\'t exist'
        });
      else
        this.userObject.sendToast({
          message: 'You don\'t have the items for this recipe'
        });
    }
  }

  async findRecipe() {
    const r = recipes.find(r => {

      const recipe = r.recipe;

      if (recipe.length !== 9)
        return false;

      let pass = true;

      for (let i = 0; i < recipe.length; i++) {

        const userInventoryIdForItem = Number(this.craftingTable[i]);

        // If blank space skip
        if (recipe[i] === 0 && userInventoryIdForItem === 0)
          continue

        // Find item based on userInventoryId
        const itemFromId = this.user.inventory.find(inv => {
          return inv.id === userInventoryIdForItem
        });


        if (!itemFromId || recipe[i].id !== itemFromId.item_id) {
          pass = false
        }

      }

      console.log(pass)
      return pass;
    });

    if (!r)
      return false;


    console.log("Found recipe", r)
    this.compactCraftingTable = groupBy(r.recipe, 'id')

    return r;
  }

  hasItemsForRecipe() {

    for (const item in this.craftingTable) {

      const itemInCraftingTable = Number(this.craftingTable[item]);

      if (itemInCraftingTable === 0)
        continue;

      const found = this.user.inventory.find(s => s.id === itemInCraftingTable)

      if (!found || found.amount < this.compactCraftingTable[found.item_id].length)
        return false;
    }

    return true;
  }

  async craftItem() {
    const outcome = this.recipe.outcome;

    console.log(this.compactCraftingTable);
    for (const i in this.compactCraftingTable) {

      if (i === "undefined")
        continue;

      const itemAmount = this.compactCraftingTable[i].length;
      const item = this.compactCraftingTable[i][0]
      const itemInInventory = this.user.inventory.find(s => {
        return s.item_id === item.id
      })
      await this.userObject.takeItem(itemInInventory, itemAmount)
    }


    await this.userObject.giveItem(outcome, 1);

    this.userObject.sendToast({
      message: "Crafted item"
    })
  }
}

module.exports = Crafting
