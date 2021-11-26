const db = require("../models")
const skills = require("../config/skills");
const xpTable = require("../config/xpTable");
const _ = require('lodash')
const items = require('../config/items')
const Crafting = require("../skills/Crafting");
const {random} = require("lodash/number");
const {omit} = require("lodash/object");
const fs = require("fs");
const chatCommands = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

let commands = [];

for (const file of chatCommands) {
  const command = require(`../commands/${file}`);

  commands.push(command);
}

class User {
  constructor(user) {
    this.user = {}

    this.equipped = [];

    this.inventory = [];

    this.timers = [];

    this.socket = null;

    this.activeSkill = null;

    this.activeId = null;

    this.activeTimer = null;

    this.xpTable = xpTable;

    this.forceStop = false;

    this.messageTimer = null;

    this.canSendMessage = true;
  }

  bootUser() {
    this.emit("user", omit(this.user, 'socket'));

    let skillConfig = _.cloneDeep(skills)

    skillConfig.map(s => {
      const loc = this.user.unlocked_locations.find(location => location.location === s.id);

      if (loc) {
        s.discovered = true
        s.ticks = loc.ticks;
      }

      if (s.loot) {
        s.loot = _.map(s.loot, function (n) {
          return _.omit(n, 'chance')
        })
      }

      if (s.skill === 'combat') {
        for (const m in s.monsters) {
          const mob = s.monsters[m];

          mob.monster.loot = _.map(mob.monster.loot, n => _.omit(n, 'chance'))
        }
      }

      return s;
    });

    if (this.combat && this.combat.players.length > 0)
      this.combat.reconnect(this.socket)

    skillConfig = skillConfig.filter(s => s.discovered !== false)
    this.emit("config:skills", skillConfig)
    console.log('sent config')

  }

  clearTimers() {
    let timers = this.timers;

    if(!timers)
      return;

    for (let i = 0; i < timers.length; i++) {
      const t = timers[i];
      clearTimeout(t.timer);
      this.timers = timers.slice(i, 1);
    }
  }

  clearTimer(timerName) {
    const timer = this.timers.find(t => t.name === timerName);

    if (timer)
      clearTimeout(timer.timer);
  }

  setTimer(timerName, fn, time) {

    if(!this.timers) {
      console.log('timers is null for some whack reason idk why')
      console.log(this.timers)
      this.timers = [];
    }

    console.log(this.timers)

    this.timers.push({
      name: timerName,
      timer: setTimeout(fn, time),
    })
  }

  setSocketIO(io) {
    this.io = io;
  }

  setSocket(socket, io) {
    this.socket = socket;
    this.io = io;

    if (this.combat) {
      this.combat.setPlayer(
        this
      );
    }

    // Default channels to join when the user has an active socket
    this.socket.join('general chat');
  }

  async loadUser(token) {

    let char = {};

    this.user.user = char.user = await db.User.findOne({
      where: {
        id: token.id
      },
      limit: 1,
    });

    this.user.character = char.characters = await db.Characters.findOne({
      where: {
        user_id: token.id
      },
      limit: 1,
      include: [
        db.UserLevels,
      ]
    });

    this.user.unlocked_locations = char.unlocked_locations = await db.UnlockedLocations.findAll({
      where: {
        user_id: this.user.character.id
      },
    });

    this.user.inventory = char.inventory = await db.UserInventory.findAll({
      where: {
        user_id: this.user.character.id
      },
      include: {
        all: true,
        nested: true,
      }
    });

    this.user.relationships = char.relationships = await db.Relationships.findAll({
      where: {
        user_id: this.user.character.id
      },
      include: [{
        model: db.Characters,
        as: 'other_user',
        attributes: ['id', 'username']
      }]
    });

    this.user.socket = this.io

    if (this.socket) {
      this.socket.join(`user-${token.id}`);
      this.socket.join(`character-${this.user.character.id}`);
    }

    this.bootUser();
  }

  equipItem(itemId) {

    if (this.combat) {
      this.sendToast({
        message: "You cannot equip in combat"
      });
      return;
    }

    const item = this.user.inventory.find(i => i.id === itemId);

    if (!item) {
      this.emit('error cant equip')
      return
    }

    if (item.Item.equippable) {
      this.unequipItemSlot(item.Item.equip_slot);
      item.equipped = true;
      item.save();
      this.emit('equip item', itemId);
    }
  }

  unequipItemSlot(slot) {
    if (this.combat) {
      this.sendToast({
        message: "You cannot unequip in combat"
      });
      return;
    }
    const item = this.user.inventory.find(i => i.Item.equip_slot === slot && i.equipped === true)

    if (item) {
      this.unEquipItem(item.id)
    }
  }

  unEquipItem(itemId) {
    if (this.combat) {
      this.sendToast({
        message: "You cannot unequip in combat"
      });
      return;
    }
    const item = this.user.inventory.find(i => i.id === itemId)

    if (item) {
      item.equipped = false;
      item.save();

      this.emit('unequip item', itemId);
    }
  }

  async startSkill(skillId) {
    const skill = skills.find(i => i.id === skillId);

    // Get current date - 12 hours, if time is greater than
    const time = (new Date());
    const session_ends = (new Date(this.user.character.session_ends));
    const diff = session_ends - time;

    console.log("Starting skill", skill)

    if (skill.discoverable) {
      const currentlyUnlocked = this.user.unlocked_locations.find(l => {
        return l.location === skill.id
      });

      if (currentlyUnlocked.ticks <= 0) {
        console.log("No ticks left on current place, ending skill")
        this.stopSkill();
        return;
      }

    }

    const currentLevel = this.user.character.UserLevel[skill.skill + '_level'];

    if (currentLevel < (skill.level || 0)) {
      console.log('no level', currentLevel, skill.level)
      this.stopSkill();
      return
    }

    if (diff <= 0 || this.forceStop) {
      console.log('session ends or force stop', this.forceStop, diff)
      this.stopSkill();
      return;
    }

    if (!skill)
      return;


    if (this.user.character.current_skill !== skillId) {
      this.user.character.current_skill = skillId;
      this.user.character.save();
    }

    this.clearTimers();

    const s = require(`../skills/${_.capitalize(skill.skill)}.js`);

    // Combat works on a different sort of tick system in which the battle contains the ticks so we need it's own logic
    if (skill.skill === 'combat') {

      if (this.user.character.health <= 0) {
        this.sendToast({
          message: "You do not have enough health to fight yet"
        });
        this.stopSkill()
        return;
      }

      this.emit("start skill", {
        timer: -1,
        id: skill.id,
      });

      // When the server restarts we need to check if they are in combat already, if so reconnect them
      if (!this.combat) {
        this.combat = new s(skill, this.io);

        this.combat.setPlayer(this);
        this.combat.setEnemy(skill.monsters)

        this.combat.startFight();
      } else {
        this.combat.reconnect(this.socket)
      }

    } else {


      const currentSkill = (new s(this.socket, this, skill))

      const checks = await currentSkill.checks();

      if(!checks) {
        this.stopSkill();

        return;
      }

      let timer = this.getSkillTimer(skill);

      this.emit("start skill", {
        timer: timer,
        id: skill.id,
      });

      this.setTimer(skill.skill, async () => {
        const currentSkill = (new s(this.socket, this, skill))
        await currentSkill.tick();

        if (!this.forceStop)
          await this.startSkill(skillId)
        else
          this.stopSkill();
      }, timer)
    }
  }

  stopSkill() {
    console.log("Stopping skill")
    this.clearTimers();

    this.user.character.current_skill = null;
    this.user.character.save();

    if (this.combat) {
      this.combat.endFight();
      this.combat = null;
    }

    this.forceStop = false;

    this.emit("stop skill");
  }

  getSkillTimer(skill) {

    const items = this.user.inventory.filter(s => s.equipped === true);

    const reducer = function (a, b) {
      if (typeof a === 'number') {
        return a + b.enchantment_strength
      }

      return a.enchantment_strength + b.enchantment_strength
    }

    let timer = null;

    if (skill.skill === 'adventuring')
      timer = (random(50, 120) * 1000);
    else
      timer = skill.timer;

    let enchantments = [0];

    for (const item in items) {
      const i = items[item];

      for (const en in i.ItemEnchantments) {
        const enchantment = i.ItemEnchantments[en];

        if (enchantment.enchantment_name === `${skill.skill}Speed`) {
          enchantments.push(enchantment)
        }
      }
    }

    const speedReduction = enchantments.reduce(reducer);

    const t = ((timer / 100 * (100 - speedReduction))).toFixed(2);
    console.log("setting timer for timer", t)
    return t;
  }

  async takeItem(item, amount = 1, combat_inventory = false) {

    item.amount -= amount;

    if (item.amount === 0) {
      item.destroy();
      const id = this.user.inventory.findIndex(i => i.id === item.id && i.combat_inventory === combat_inventory)
      this.user.inventory.splice(id, 1)
    } else {
      item.save();
    }

    this.emit("inventory add item", item)
  }

  async giveItem(item, amount = 1, combat_inventory = false) {

    if (typeof item === "string") {
      item = items[item]

      if (!item)
        return;
    }

    let found = this.user.inventory.find(i => i.item_id === item.id && i.combat_inventory === combat_inventory)

    if (!found || item.stackable === false || combat_inventory) {
      console.log("Not found so creating item", !found, item.stackable, combat_inventory)
      const find = await db.UserInventory.create({
        user_id: this.user.user.id,
        item_id: item.id,
        amount: amount,
        combat_inventory: combat_inventory
      });

      const newItemId = find.id;

      const stats = [
        'attack',
        'defense',
        'armor_penetration',
        'speed'
      ]

      for (const stat in stats) {
        if (item[stats[stat]]) {

          await db.ItemAttributes.create({
            item_id: find.id,
            attribute: stats[stat],
            value: item[stats[stat]]
          })
        } else {
          console.log('no stat found', stats[stat]);
        }
      }

      for (const enchant in item.enchantments) {
        let itemEnchantment = item.enchantments[enchant];

        await db.ItemEnchantments.create({
          item_id: find.id,
          enchantment_name: itemEnchantment.name,
          enchantment_strength: itemEnchantment.strength,
        })
      }

      // https://stackoverflow.com/questions/67877914/sequelize-include-association-when-creating-a-new-model
      // idfk tbh
      found = await db.UserInventory.findOne({
        where: {
          id: newItemId,
        },
        include: [db.Item, db.ItemAttributes, db.ItemEnchantments]
      });

      this.user.inventory.push(found);
    } else {
      found.amount += Number(amount);
      found.save();
    }

    this.emit("inventory add item", found)
  }

  async craftItem(table) {
    // We pass in the inventory id's of the item
    // so we need to get the actual item from the id

    const craft = new Crafting(this.socket, this)
    craft.setCraftingTable(table);
    await craft.tick()
  }

  openItem() {

  }

  async eatItem(itemId, amount = 1, force = false) {
    const item = this.user.inventory.find(i => i.id === itemId);

    if (this.combat && !force) {
      this.sendToast({
        message: `You cannot eat from your inventory during combat`
      });
      return;
    }

    if (item && item.Item.can_eat) {
      const remainingHealth = this.user.character.max_health - this.user.character.health;
      const requiredFoodToFill = Math.ceil(remainingHealth / item.Item.health_given);

      // If the amount is more than that required to fill then auto fix the amount
      if (amount > requiredFoodToFill)
        amount = requiredFoodToFill

      if (amount === 0) {
        this.sendToast({
          message: `You are already full ${amount} - ${requiredFoodToFill}`
        });
        return;
      }

      await this.takeItem(item, amount, true)

      this.user.character.health += (item.Item.health_given * amount);

      if (this.user.character.health > this.user.character.max_health)
        this.user.character.health = this.user.character.max_health;

      const healthGained = amount * item.Item.health_given;

      this.emit("character update", {
        health: this.user.character.health
      })

      this.sendToast({
        message: `You ate ${amount} ${item.Item.name} and gained ${healthGained} health`
      })
    }
  }

  async consumeForHeat(itemId, amount) {
    const item = this.user.inventory.find(i => i.id === itemId);

    console.log(item.Item);

    if (!item || !item.Item.heat)
      return;

    await this.takeItem(item, amount);

    this.user.character.heat += (item.Item.heat * amount)

    this.user.character.save();

    this.emit("character update", {
      heat: this.user.character.heat
    })
  }

  async sell(itemId, amount) {
    const item = this.user.inventory.find(i => i.id === itemId);

    console.log(item.Item);

    if (!item || !item.Item.value || !item.Item.can_sell)
      return;

    await this.takeItem(item, amount);

    this.user.character.gold += (item.Item.heat * amount)

    this.user.character.save();

    this.emit("character update", {
      gold: this.user.character.gold
    })
  }

  async addToCombatInventory(itemId, amount) {

    if (this.combat) {
      console.log(this.combat);
      this.sendToast({
        message: `You cannot add items to your inventory while in combat`
      });
      return;
    }

    const item = this.user.inventory.find(i => i.id === itemId);

    if (!item || !item.Item.combat_inventory)
      return;

    const count = this.user.inventory.filter(s => s.combat_inventory)
    console.log("Count for inventory", count, count.length)
    const diff = 8 - count.length;

    if (diff > 0) {
      if (amount > diff)
        amount = diff;

      await this.takeItem(item, amount);

      for (let i = 0; i < amount; i++)
        await this.giveItem(item.Item, 1, true);
    } else {
      this.sendToast({
        message: `You are already at max capacity in your backpack`
      })
    }

  }

  async removeFromCombatInventory(itemId) {

    const item = this.user.inventory.find(i => i.id === itemId && i.combat_inventory === true);

    console.log("removing from comba tinventory")
    console.log(itemId, item)

    if (!item)
      return;

    await this.takeItem(item, 1, true);
    await this.giveItem(item.Item, 1);

  }

  async consumeCombatInventoryItem(itemId) {
    const item = this.user.inventory.find(i => i.id === itemId);

    console.log(
      `consuming item`, item
    );

    if (item.Item.health_given) {
      await this.eatItem(itemId, 1, true)
    } else {
      await this.takeItem(item, 1, true);
      await this.giveItem(item.Item)
    }
  }

  touchSession() {
    this.user.character.session_ends = (new Date()).getTime() + (12 * 60 * 60 * 1000)
    this.user.character.save();
  }

  async chatSendMessage(message, messages) {
    if (message.length < 2 || message.length > 140)
      return;

    const diff = this.timeLeft(this.user.muted)
    console.log(diff);
    if (diff !== false) {
      console.log("muted", diff);
      this.emit("timeout", {
        message: diff
      })
      return;
    }

    console.log(this.user.muted);

    if (message.startsWith('/')) {
      console.log("Command issued");

      const args = message.slice(1).trim().split(/ +/);
      const commandIssued = args.shift().toLowerCase();
      const command = commands.find(c => c.command === commandIssued);

      if (command) {
        console.log(command.staff, this.user.user.staff)
        if (command.staff && command.staff >= (this.user.user.staff || 0)) {
          this.emit('new chat message', {
            from: "System",
            message: "Permission denied :(",
            system: true,
          })
        } else {
          await command.execute(this.io, this, message, args)
        }
      } else {
        this.emit('new chat message', {
          from: "System",
          message: "Invalid syntax",
          system: true,
        })
      }

    } else {
      if (messages.length > 100) {
        messages.splice(messages.length - 1, 1);
      }

      const tempMessage = await db.chat_messages.create({
        user_id: this.user.character.id,
        message: message,
      });

      console.log("Finding message", tempMessage.id)

      const chatMessage = await db.chat_messages.findOne({
        where: {
          id: tempMessage.id
        },
        include: [{
          model: db.Characters,
          attributes: ['id', 'user_id', 'username', 'badge', 'title'],
          include: [{
            model: db.User,
            attributes: ['id', 'staff']
          }]
        },]
      })

      console.log("Sending message", chatMessage);
      messages.unshift(chatMessage);

      this.io.to('general chat').emit("new chat message", chatMessage)

      this.messageTimer = setInterval(() => {
        this.canSendMessage = true;
      }, 5000)

    }
  }

  sendChatMessage(obj = {}) {

    const from = obj.from || 'System'
    this.emit("new chat message", {
      from: from,
      message: obj.message,
      system: obj.system || false
    })
  }

  emit(event, obj) {
    if (this.socket)
      this.socket.emit(event, obj)
  }

  muteUser(minutes = 60) {
    console.log("Muting user for 10 min", this.user.muted);
    this.user.muted = new Date().getTime() + (minutes * 60 * 1000)
    console.log("Muting user for 10 min", this.user.muted);
    this.user.save();
  }

  sendToast(obj = {}) {
    this.emit("global toast", obj)
  }

  disconnect() {
    // this.socket.disconnect();
    // this.socket = null;
    this.emit("new tab opened")

    console.log("Disconnected socket")
  }

  async addRelationship(userId, type = 'friend') {
    // First check if they have an existing relationship
    const relationships = this.user.relationships;

    const find = relationships.find(r => r.other_user_id === userId)

    if (!find) {
      let rel = await db.Relationships.create({
        user_id: this.user.character.id,
        other_user_id: userId,
        type: type
      });

      rel = await rel.reload({
        include: [{
          model: db.Characters,
          as: 'other_user',
          attributes: ['username']
        }]
      });
      relationships.push(rel);

      this.emit('add relationship', rel)
    } else {

      // Check if it's a block request and make it override things
      // This allows 1 click block rather than asking user to remove friend then block them
      if (type === 'block') {
        // Attempt to remove them as friend
        await this.removeRelationship(userId);

        let rel = await db.Relationships.create({
          user_id: this.user.character.id,
          other_user_id: userId,
          type: type
        });


        rel = await rel.reload({
          include: [{
            model: db.Characters,
            as: 'other_user',
            attributes: ['username']
          }]
        });

        relationships.push(rel);
        this.emit('add relationship', rel)

        return;
      }

      this.sendToast({
        message: `You have already ${type}ed this person`
      })
    }
  }

  async removeRelationship(userId) {
    // First check if they have an existing relationship
    const relationships = this.user.relationships;

    const find = relationships.findIndex(r => r.other_user_id === userId)

    if (find > -1) {
      this.emit('remove relationship', relationships[find])
      relationships[find].destroy();
      relationships.splice(find, 1)

    } else {
      this.sendToast({
        message: `This relationship doesn't exist`
      })
    }
  }

  timeLeft(time) {
    const now = new Date();

    let delta = Math.abs(time - now) / 1000;

    console.log('time left', time - now, time, now)

    if (!time || time - now < 0)
      return false;

    const days = Math.floor(delta / 86400);
    delta -= days * 86400;

    const hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;

    const minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;

    if (days > 0)
      return `${days} day${days > 1 ? 's' : ''} left`
    else if (hours > 0)
      return `${hours} hour${hours > 1 ? 's' : ''} left`
    else if (minutes > 0)
      return `${minutes} minute${minutes > 1 ? 's' : ''} left`
    else
      return `time soon`
  }
}

module.exports = User
