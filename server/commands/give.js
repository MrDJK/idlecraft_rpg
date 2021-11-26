module.exports = {
  name: 'Give',
  command: 'give',
  staff: 5,
  execute(io, user, message, args) {
    const item = args[0]
    const amount = args[1] || 1

    console.log('command', item, amount)
    user.giveItem(item, amount)

    user.sendChatMessage({
      system: true,
      message: `Given x${amount} ${item}`
    })
  }
}
