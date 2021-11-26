<template>
    <div>
        <div class="d-flex flex-column recipe-column"
             :class="{'disabled': !hasIngredients}">
            <div class="d-flex align-items-center">
                <span>{{ recipe.name }}</span>
                <div class="ms-auto">

                    <v-tooltip>
                        <mc-icon icon="coal" :size="16" class="ms-auto" />
                        <span :class="{'text-danger': !hasEnoughHeat}">{{ recipe.heat }}</span>

                        <template #popper>
                            Gain heat by consuming coal and sticks
                        </template>
                    </v-tooltip>
                </div>
            </div>
            <div class="d-flex flex-row justify-content-center align-items-center mb-2">
                <div class="messages">
                    <transition-group name="messageList">
                        <div class="message" v-for="m in messages" :key="m.id">
                            <div class="d-inline-flex px-4 flex-row align-items-center justify-content-center">
                                <template v-if="m.items">
                                    <Item
                                            :item="i"
                                            :size="1"
                                            v-for="(i, index) in m.items"
                                            :key="index"/>
                                </template>
                                {{ m.message }}
                            </div>
                        </div>
                    </transition-group>
                </div>
                <div class="ingredients d-flex flex-row">
                    <Item :item="ing" v-for="(ing, i) in recipe.ingredients" :key="i" class="me-2" :size="36"/>
                </div>
                <div class="ms-auto">
                    =
                </div>
                <div class="outcome">
                    <Item :item="recipe.outcome" :size="36"></Item>
                </div>
                <div class="d-flex align-items-center ms-3">
                    <button @click="startSkill" v-if="!started && !waitingForStatus" :disabled="!hasIngredients">Cook
                    </button>
                    <button @click="stopSkill" v-if="started || waitingForStatus">Stop</button>
                </div>
            </div>
        </div>
        <div v-if="waitingForStatus" class="d-block w-100 position-absolute text-center bg-dark-opacity no-hover">
            Waiting for status
        </div>
        <SocketProgressBar :skill="recipe"/>
    </div>
</template>
<style lang="scss" scoped>

.message .item {
    background: none !important;
}
</style>
<script>
import Item from "./Item";
import SocketProgressBar from "./SocketProgressBar";
import store from '../store'
import McIcon from "./McIcon";

export default {
  name: 'CookingRecipeRow',
  components: {McIcon, SocketProgressBar, Item},
  data() {
    return {
      store: store.state,
      started: false,
      messages: [],
    }
  },
  props: {
    recipe: {
      type: Object,
      required: true,
    }
  },
  methods: {
    startSkill() {
      this.$socket.emit('auth:start skill', this.recipe.id)
    },
    stopSkill() {
      this.$socket.emit('auth:stop skill')
    }
  },
  computed: {
    hasIngredients() {
      let hasEnough = true;

      for (const i in this.recipe.ingredients) {
        const reqIngredient = this.recipe.ingredients[i];

        const inventoryItem = this.store.user.inventory.find(s => s.item_id === reqIngredient.item.id && s.amount >= (reqIngredient.quantity || 1));

        if (!inventoryItem)
          hasEnough = false;
      }

      if(!this.hasEnoughHeat)
        return false;

      return hasEnough;
    },
    waitingForStatus() {
      return this.store.user.character.current_skill === this.recipe.id && !this.started;
    },
    hasEnoughHeat() {
      return this.store.user.character.heat >= this.recipe.heat
    }
  },
  sockets: {
    'gain xp': function (skill) {
      if (skill.skill === this.recipe.id && this.messages.length < 5) {
        this.messages.push({
          id: this.messages.length + Math.floor(Math.random() * 100),
          message: `+${skill.xp}xp`,
          items: skill.items
        });

        setTimeout(() => {
          this.messages.splice(0, 1);
        }, 3000);
      }
    },

    'stop skill': function () {
      this.started = false;
    },
    'start skill': function (skill) {
      if (skill.id === this.recipe.id) {
        this.timer = skill.timer;
        this.started = true;
      }
    },
  }
}
</script>
