'use strict';
const {snakeCase} = require("lodash/string");
const db = require("../models")
const {sections, items} = require("../tools/spritebuilder/items");
const baseItemList = require("../config/items");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    let itemList = [];

    for (const i in items) {
      const itemName = snakeCase(i).toUpperCase();
      const baseItem = baseItemList[itemName];

      const findItem = await db.Item.findOne({
        where: {
          name: i
        },
        include: {all: true, nested: true}
      });

      if (!findItem) {
        console.log("created item")
        console.log("created item")
        console.log("created item")
        console.log("created item")
        console.log("created item")
        console.log("created item")
        console.log(i)
        itemList.push({
          name: i,
          type: sections.find(s => s.id === items[i].section).name,
          equippable: baseItem ? baseItem.equippable : false,
          equip_slot: baseItem ? baseItem.type : null,
          createdAt: new Date(),
          updatedAt: new Date()
        });

        continue;
      }

      // Update the basic shit, if any items attributes are added they also need to be added here

      findItem.equippable = baseItem ? baseItem.equippable : findItem.equippable;
      findItem.equip_slot = baseItem ? baseItem.equip_slot : findItem.equip_slot;
      findItem.tradable = baseItem ? baseItem.tradable : findItem.tradable;
      findItem.sockets = baseItem ? baseItem.sockets : findItem.sockets;
      findItem.attack = baseItem ? baseItem.attack : findItem.attack;

      findItem.defense = baseItem ? baseItem.defense : findItem.defense;
      findItem.speed = baseItem ? baseItem.speed : findItem.speed;
      findItem.armor_penetration = baseItem ? baseItem.armor_penetration : findItem.armor_penetration;
      findItem.image = baseItem ? baseItem.image : findItem.image;
      findItem.type = baseItem ? baseItem.type : findItem.type;
      findItem.can_eat = baseItem ? baseItem.can_eat : findItem.can_eat;
      findItem.health_given = baseItem ? baseItem.health_given : findItem.health_given;
      findItem.can_open = baseItem ? baseItem.can_open : findItem.can_open;
      findItem.can_sell = baseItem ? baseItem.can_sell : findItem.can_sell;
      findItem.value = baseItem ? baseItem.value : findItem.value;
      findItem.heat = baseItem ? baseItem.heat : findItem.heat;
      findItem.staff = baseItem ? baseItem.staff : findItem.staff;
      findItem.combat_inventory = baseItem ? baseItem.combat_inventory : findItem.combat_inventory;
      findItem.stackable = baseItem ? baseItem.stackable : findItem.stackable;

      findItem.save();

      // Find all items that have the above id and update enchantments for them

      const findExistingItems = await db.UserInventory.findAll({
        where: {
          item_id: findItem.id
        },
        include: {all: true, nested: true}
      });

      if(findExistingItems.length > 0) {
        // Loop over found items
        for (const foundItem of findExistingItems) {

          if(!baseItem)
            continue;
          // Check if there are base enchantments
          if (baseItem.enchantments) {
            for (const enchant of baseItem.enchantments) {
              const findEnchant = foundItem.ItemEnchantments.find(s => s.enchantment_name === enchant.name)

              if(findEnchant)
              {
                findEnchant.enchantment_strength = enchant.strength;
                findEnchant.save();
              }
            }
          }
        }
      }
    }

    if (itemList.length > 0)
      await queryInterface.bulkInsert('items', itemList)
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
