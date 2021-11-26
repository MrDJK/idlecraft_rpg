<template>
    <div class="card mb-3 location-card border-0">
        <div class="location-lock d-flex align-items-center justify-content-center bg-darker-opacity" v-if="!hasRequiredLevel">
            <div>
                <mc-icon :icon="skill.skill" :skill="skill.skill" class="mx-auto"></mc-icon>
                Required Level {{ this.skill.level }}
            </div>
        </div>
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

        <template v-if="skill.skill !== 'combat'">
            <div class="card-header bg-dark-opacity py-4">
                <h4 class="card-title pb-0 mb-0 text-white d-flex flex-row">
                    {{ skill.name }}
                </h4>
            </div>
            <div class="card-body d-flex flex-column skill-box p-0 border-0">
                <span class="badge bg-secondary ms-auto" v-if="skill.ticks">{{ skill.ticks }} Actions Left</span>
                <div class="mt-auto">
                    <div v-if="waitingForStatus" class="d-block w-100 position-absolute text-center bg-dark-opacity no-hover">Waiting for status
                    </div>
                    <SocketProgressBar :skill="skill"/>
                </div>
                <div class="loot-box">
                    <ul class="list-unstyled d-flex flex-row align-items-center mb-0">
                        <li v-for="(l, index) in skill.requires || skill.loot" :key="index">
                            <Item :item="l.item" :quantity="l.quantity" :size="24"
                                  :invalid-amount="invalidQuantity(l)" v-if="l.item" class="me-2"/>
                        </li>

                        <li class="ms-auto">
                            <div class="badge bg-secondary d-flex align-items-center flex-row">
                                <mc-icon icon="clock" :size="12" class="me-2"/>
                                {{ timeForSkill }}s
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </template>

        <template v-else>
            <div class="card-header">
                <h4 class="card-title pb-0 mb-0">{{ skill.name }}</h4>
            </div>
            <div class="card-body d-flex flex-column skill-box">
                <div class="mt-auto ml-auto">
                    <ul class="list-unstyled d-flex flex-row justify-content-around flex-wrap">
                        <li v-for="(l, index) in skill.monsters" :key="index" class="">
                            <img :src="`/images/mobs/${l.monster.render.model}.png`" :alt="`${l.name} image`" class="monster-image me-2" />
                        </li>
                    </ul>
                </div>
            </div>
        </template>

        <div class="card-footer p-0 m-0">
            <div class="bottom-box">
                <div class="d-grid mt-auto">
                    <button v-if="isWorkingOnThisSkill" @click="stopSkill"
                            class="btn btn-danger btn-block rounded-0"
                            type="button">Stop
                    </button>
                    <button v-else @click="startSkill" class="btn btn-primary btn-block rounded-0" :class="[!hasRequiredLevel ? 'btn-secondary' : 'btn-primary']" type="button"
                    :disabled="!hasItemsRequired">
                        {{ skill.skill === 'combat' ? 'Fight!' : 'Start'}}
                    </button>
                </div>
            </div>
        </div>
        <div class="location-background" :style="`background-image:url(${getImage})`"></div>
    </div>
</template>
<style lang="scss">
.skill-box {
    min-height: 300px;
    max-height: 100vh;
}

.skillbox-bg-location {
    border: 0;
}

.messages {
    z-index: 15;
}

.skill-image {
    max-width: 100%;
    width: 300px;
}


.location-card {

    overflow: hidden;
    .card-header,
    .card-footer,
    .card-body {
        z-index: 10;
        border: 0;
    }

    .loot-box {
        background: rgba(0,0,0,0.7);
        padding: 1rem;
    }

    .location-background {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center center;
        z-index: 5;
        transition: all ease-in-out .3s;
    }

    &:hover {
        .location-background {
            transform: scale(1.1);
        }
    }
}

.location-lock {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 99;
}

//.messageList-enter-active {
//    transition: all ease-in-out 0.4s;
//    //background: red; // Highlight new message briefly
//}
</style>
<script>
import store from '../store'
import SocketProgressBar from "./SocketProgressBar";
import Item from "./Item";
// import {format, quality} from '@cloudinary/base/actions/delivery'
import {scale} from '@cloudinary/base/actions/resize'
import McIcon from "./McIcon";
// import {auto} from "@cloudinary/base/qualifiers/format";
// import {auto as qAuto} from "@cloudinary/base/qualifiers/quality";

export default {
  name: 'Skillbox',
  components: {McIcon, Item, SocketProgressBar},
  data() {
    return {
      started: false,
      timer: null,
      messages: [],
      store: store.state,
    }
  },
  props: {
    skill: {
      type: Object
    }
  },
  mounted() {
  },
  methods: {
    stopSkill() {
      this.$socket.emit("auth:stop skill");
    },
    startSkill() {
      this.$socket.emit("auth:start skill", this.skill.id);
    },
    invalidQuantity(item) {

      if (!item || !item.item)
        return false;

      const reqIngredient = item;
      const inventoryItem = this.store.user.inventory.find(s => s.item_id === reqIngredient.item.id && s.amount >= reqIngredient.quantity);

      if (!inventoryItem)
        return true;

      return false;
    },
  },
  computed: {
    isWorkingOnThisSkill() {
      return this.started || this.store.user.character.current_skill === this.skill.id;
    },
    waitingForStatus() {
      return this.store.user.character.current_skill === this.skill.id && !this.started;
    },
    getImage() {
      const image = window.$cld.image(this.skill.image)
        .resize(scale().width(500))
      // .delivery(format(auto()))
      // .delivery(quality(qAuto()))
      return image.toURL();
    },
    timeForSkill() {
      const items = this.store.user.inventory.filter(i => i.equipped === true);

      const reducer = function (a, b) {
        if (typeof a === 'number') {
          return a + b.enchantment_strength
        }

        return a.enchantment_strength + b.enchantment_strength
      }
      let timer = this.skill.timer;
      let enchantments = [0];

      for (const item in items) {
        const i = items[item]

        console.log(i.ItemEnchantments)
        for(const en in i.ItemEnchantments)
        {
          const enchantment = i.ItemEnchantments[en];

          if (enchantment.enchantment_name === `${this.skill.skill}Speed`) {
            enchantments.push(enchantment)
          }
        }
      }


      const speedReduction = enchantments.reduce(reducer);

      console.log("Speed reduction for skill", speedReduction)

      return ((timer / 100 * (100 - speedReduction)) / 1000).toFixed(2)
    },

    hasItemsRequired() {
      if(!this.skill.requires)
        return true;

      console.log('skiil', this.skill)

      for (const i in this.skill.requires) {
        const reqIngredient = this.skill.requires[i];

        const inventoryItem = this.store.user.inventory.find(s => s.item_id === reqIngredient.item.id && s.amount >= reqIngredient.quantity);

        if (!inventoryItem)
          return false;
      }

      return true;
    },
    hasRequiredLevel() {
      const currentLevel = this.store.user.character.UserLevel[this.skill.skill + '_level'];

      console.log(currentLevel, this.skill.level)

      if(!currentLevel || !this.skill.level)
        return true;

      return currentLevel >= this.skill.level
    }
  },
  sockets: {
    'gain xp': function (skill) {
      if (skill.skill === this.skill.id && this.messages.length < 5) {
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
      if (skill.id === this.skill.id) {
        this.timer = skill.timer;
        this.started = true;
      }
    },
  }
}
</script>
