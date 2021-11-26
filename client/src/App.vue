<template>
    <div v-if="!disconnected" class="h-100">
        <router-view/>
    </div>

    <div class="d-flex justify-content-center w-25 mx-auto h-100 flex-column" v-else>
        <div v-if="!disconnected_reason">
            <h1 class="border-left-blue ps-3 mb-3">Under Maintenance</h1>
            <h3 class="text-muted mb-3">We are attempting to reconnect you</h3>
            <h5 class="text-light mb-5">We will try to reconnect you automatically when the server becomes available
                again</h5>
            <p>For Status updates please visit our <a href="https://discord.gg/SZDzVnSCZF" target="_blank">Discord</a>
            </p>
        </div>
        <div v-else-if="disconnected_reason === 'new_tab'">

            <h1 class="border-left-blue ps-3 mb-3">New Tab Opened</h1>
            <h3 class="text-muted mb-3">It seems a session has been started elsewhere, to continue this session, please
                refresh the page</h3>
        </div>
    </div>
</template>
<style lang="scss">
@import "assets/styles/app.scss";

#app {
    height: 100%;
}

.disconnected {
    position: absolute;
    display: flex;
    height: 100%;
    width: 100%;
    justify-content: center;
    align-items: center;
    top: 0;
    left: 0;
    background: white;
}
</style>
<script>
import store from './store'

export default {
  data() {
    return {
      disconnected: false,
      store: store.state,
      date: new Date(),
      disconnected_message: null,
      disconnected_reason: 'No reason provided',
    }
  },
  mounted() {
    setInterval(() => {
      this.date = new Date()
    }, 1000)
  },
  sockets: {
    disconnect() {
      this.store.readyToPlay = false;
      this.disconnected = true;
    },
    reconnected() {
      console.log('reconnected')
      this.disconnected = false;
    },
    connect() {
      console.log('connect')
      this.disconnected = false;

      if (localStorage.getItem(process.env.VUE_APP_JWT_NAME))
        this.$socket.emit("auth", {
          token: localStorage.getItem(process.env.VUE_APP_JWT_NAME)
        })
    },
    logout() {
      localStorage.removeItem(process.env.VUE_APP_JWT_NAME)
      this.$router.push({
        name: 'Home'
      })
    },
    'add:jwt': function (token) {
      localStorage.setItem(process.env.VUE_APP_JWT_NAME, token);
      this.$socket.emit("auth", {token})
    },
    'user': (user) => {
      store.state.user = user;
      console.log(store.state.user)
    },
    'config:skills': (skills) => {
      store.state.skills = skills;
    },
    'inventory add item': (item) => {
      let it = store.state.user.inventory.find(i => i.id === item.id);

      if (!it)
        store.state.user.inventory.push(item)
      else
        if(item.amount === 0) {
          const itID = store.state.user.inventory.findIndex(i => i.id === item.id)
          store.state.user.inventory.splice(itID, 1)
        } else {
          it.amount = item.amount
        }
    },
    'equip item'(id) {
      console.log('equipping item', id)
      const item = this.store.user.inventory.find(s => s.id === id)
      item.equipped = true;
    },
    'unequip item'(id) {
      console.log("unquipping item");
      const item = this.store.user.inventory.find(s => s.id === id)
      item.equipped = false;
    },
    'stop skill'() {
      this.store.adventureLog = [];
      this.store.combat.inProgress = false;
      this.store.combat.friendly = [];
      this.store.combat.enemies = [];
      this.store.user.character.current_skill = null;
    },
    'character update'(character) {
      for (const stat in character) {
        this.store.user.character[stat] = character[stat];
      }
    },
    'ready to play'() {
      this.store.readyToPlay = true;
    },
    'start skill': function (skill) {
      this.store.user.character.current_skill = skill.id;
    },
    'new tab opened'() {
      this.disconnected_message = 'New session opened'
      this.disconnected_reason = 'new_tab'
      this.disconnected = true;
    },
    'adventure log'(event) {
      this.store.adventureLog.push(event)
    },
    'create found locations'(skill) {
      console.log("Adding new skill", skill);
      this.store.skills.push(skill);

    },
    'update found locations'(skill) {
      console.log("updating ticks", skill)
      const s = this.store.skills.find(s => {
        console.log(s.id, skill.location);
        return s.id === skill.location
      })
      s.ticks = skill.ticks;
    },
    'remove found locations'(skill) {
      const s = this.store.skills.findIndex(s => {
        return s.id === skill.location
      })

      if(s > -1) {
        this.store.skills.splice(s, 1)
      }
    },
    "enter combat": function (fight) {
      this.store.combat.inProgress = true;
      this.store.combat.friendly = fight.friendlyTeam
      this.store.combat.enemies = fight.enemyTeam;
      this.hideUI = false;
    },
    "dead": function() {
      this.store.combat.inProgress = false;
      this.store.combat.friendly = [];
      this.store.combat.enemies = [];
      this.hideUI = false;
      this.store.user.character.current_skill = null;
    },
    "add relationship"(rel) {
      this.store.user.relationships.push(rel)
    },
    "remove relationship"(rel) {
      const index = this.store.user.relationships.findIndex(r => r.id === rel.id)

      this.store.user.relationships.splice(index, 1)

      console.log("Remove relationship", rel, index, this.store.user.relationships)
    },
    'timeout'(msg) {
      if(msg) {
        window.alert(msg.message)
      } else {
        window.alert("You got timed out")
      }
    }
  }
}
</script>
