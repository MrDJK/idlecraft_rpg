<template>
    <div class="p-3">
        <div class="monster-container" :class="[monster.health <= 0 ? 'monster-dead' : '']"
             :style="getModel" ref="monster">

            <div class="health-bar w-100">
                <div class="progress-outer-bar bg-dark">
                    <div class="progress-bar border-0 bg-dark-progress-grad" :style="{'width': healthWidth + '%'}">
                        {{ Math.floor(healthWidth) }}%
                    </div>
                </div>
            </div>
            <div v-for="(hit) in hits" :key="hit.hitId"
                 :class="{'bg-info': (hit.type && hit.type === 'miss') || (hit.damage === 0), 'bg-danger': hit.damage > 0}" class="hit-marker"
                 :style="{
                    left: hit.left + 'px',
                    top: hit.top + 'px',
                    'z-index': (hit.hitId + 100)
                 }">
                {{ hit.damage }}
            </div>
        </div>
        <SocketProgressBar :skill="{id: `monster-combat-${monster.id}`}"/>
    </div>
</template>
<style scoped lang="scss">
.monster-container {
    background-repeat: no-repeat;
    background-position: center center;
    background-size: contain;
    transition: all ease-in-out 0.3s;
    position: relative;
    height: 350px;
    width: 250px;
    max-width: 100%;
}

.mob-image {
    max-width: 100%;
    max-height: 100%;
}

.monster-dead {
    opacity: 0.3;
}
</style>
<script>

import SocketProgressBar from "./SocketProgressBar";
import {random} from "lodash/number";

export default {
  name: 'Monster',
  components: {SocketProgressBar},
  props: {
    monster: {
      type: Object,
      required: true,
    }
  },
  data() {
    return {
      hits: [],
      hitId: 0,
    }
  },
  watch: {
    'monster.health'(o) {
      if(o <= 0) {
        setTimeout(() => this.hits = [], 2000)
      }
    }
  },
  methods: {
    getOffsets(hit) {
      console.log('offset', {hit})
      return {
        left: hit.left + 'px',
        top: hit.top + 'px',
        'z-index': (hit.hitId + 100)
      }
    }
  },
  mounted() {

  },
  computed: {
    getTexture() {
      return this.monster.monster.render.texture
    },
    getModel() {
      return {'background-image': `url(/images/mobs/${this.monster.monster.render.model}.png)`}
    },
    health() {
      return this.monster.health;
    },
    healthWidth() {
      if(this.monster.health <= 0)
        return 0;

      return (100 / this.monster.max_health) * this.monster.health
    }
  },
  sockets: {
    'player attack'(attack) {
      console.log(attack, this.$refs.monster.clientWidth, this.$refs.monster.clientHeight);
      if (attack.enemy.id === this.monster.id) {
        this.hitId++;
        this.hits.push(Object.assign({
          hit_id: this.hitId,
          left: random(30, this.$refs.monster.clientWidth - 60),
          top: random(30, this.$refs.monster.clientHeight - 60),
        }, attack));

        // setTimeout(() => {
        //   this.hits.splice(0, 1)
        // }, 5000)
      }
    }
  }
}
</script>
