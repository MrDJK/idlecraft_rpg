<template>
    <div :class="[`d-flex`, `justify-content-center`, `align-items-center`, isActive]" @click="startSkill(skill)">

        <button class="btn btn-danger btn-back-to-town" @click="stopSkill" v-if="isActive">Stop adventuring & go back to
            town
        </button>

        <div class="adventure-info d-flex flex-column" v-if="isActive">
            <div class="mb-3">
                <h6>You are currently exploring</h6>

                <h2>{{ skill.name }}</h2>
                <h4>Adventure Log</h4>
            </div>
            <div class="h-75 w-100 info-log" ref="adventure-log">
                <p v-if="adventureLog.length === 0">
                    You have just started your adventure...
                </p>
                <ul>

                    <transition-group name="chatMessage">
                        <li v-for="(k, i) in adventureLog" :key="i" class="d-flex flex-row align-items-center chat-message mb-2">
                            <Item :item="k.items[0]" :size="32" v-if="k.items" class="me-3"/>
                            {{ k.message }}
                        </li>
                    </transition-group>
                </ul>
            </div>
        </div>

        <h2 v-else class="p-3 bg-dark-opacity">{{ skill.name }}</h2>

        <div :style="{'background-image': `url(${skill.image})`}" class="background"></div>
    </div>
</template>

<script>
import store from '../store'
import Item from "./Item";
import {nextTick} from "vue";

export default {
  name: 'AdventureLocation',
  components: {Item},
  props: {
    skill: {
      type: Object,
      required: true,
    }
  },
  data() {
    return {
      store: store.state
    }
  },
  computed: {
    skills() {
      return this.store.skills && this.store.skills.filter(i => i.skill === 'adventuring')
    },
    currentSkillId() {
      return this.store.user.character.current_skill;
    },
    currentSkill() {
      return this.store.skills.find(s => s.id === this.currentSkillId);
    },
    isActive() {
      return this.skill.id === this.currentSkillId ? 'active' : '';
    },
    adventureLog() {
      return this.store.adventureLog
    }
  },
  methods: {
    startSkill(skill) {
      if (this.currentSkill && this.currentSkill.skill === 'adventuring')
        return;

      this.$socket.emit("auth:start skill", skill.id);
    },
    stopSkill() {
      this.$socket.emit('auth:stop skill')
    },
    scrollToBottom() {
      // Vue does some weird shit sometimes, so this makes sure on the next tick it fetchs the correct height
      // so it can actually scroll to the bottom
      nextTick(() => {
        console.log(this.$refs)
        const chatBox = this.$refs['adventure-log'];

        if (chatBox)
          chatBox.scrollTop = chatBox.scrollHeight + 300;

      });
    },
  },
  sockets: {
    'adventure log'() {
      setTimeout(() => this.scrollToBottom(), 100)
    }
  }
}
</script>
