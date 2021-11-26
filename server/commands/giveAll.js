const items = require('../config/items')
module.exports = {
  name: 'Give',
  command: 'giveall',
  staff: 5,
  async execute(io, user, message, args) {
    console.log(user);
    for(let item in items)
    {
      await user.giveItem(item, 1)

      user.sendChatMessage({
        system: true,
        message: `Given x1 ${item}`
      })
    }
  }
}
