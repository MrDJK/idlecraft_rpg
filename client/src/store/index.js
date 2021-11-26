import { reactive } from 'vue';

export default {
  debug: true,
  state: reactive({
    skills: [],
    items: [],
    user: {},
    activeSkill: null,
    combat: {},
    readyToPlay: false,
    layout: {
      inventoryOpen: false,
      chatMobileOpen: false,
      itemModel: {
        show: false,
        item: null,
      },
      gameTips: JSON.parse(localStorage.getItem('gametips') || true)
    },
    adventureLog: []
  })
}
