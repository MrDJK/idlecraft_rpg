<template>
    <div class="player-render" ref="player">
        <div class="health-bar w-100">
            <div class="progress-outer-bar bg-dark">
                <div class="progress-bar border-0 bg-dark-progress-grad" :style="{'width': healthWidth + '%'}">
                    {{ Math.floor(healthWidth) }}%
                </div>
            </div>
        </div>
        <div class="player-skin head in-front" :style="getPlayerSkinHead"></div>
        <div class="player-skin chest" :style="getPlayerSkinChest"></div>
        <div class="player-skin legs" :style="getPlayerSkinLegs"></div>
        <div class="player-chestplate-right-arm" :style="getChestPlateRightArm"></div>
        <div class="player-chestplate behind" :style="getChestPlateBehind"></div>
        <div class="player-skin left-arm behind" :style="getPlayerSkinLeftArm"></div>
        <div class="player-skin right-arm" :style="getPlayerSkinRightArm"></div>
        <div class="player-helmet in-front" :style="getHelmet" v-if="currentlyEquipped"></div>
        <div class="player-chestplate" :style="getChestPlate" v-if="currentlyEquipped"></div>
        <div class="player-leggings" :style="getLeggings" v-if="currentlyEquipped"></div>
        <div class="player-boots" :style="getBoots" v-if="currentlyEquipped"></div>
        <div class="player-weapon" :style="getWeapon" v-if="currentlyEquipped" :data-weapon="getWeaponName"></div>
        <div class="hitbox">
            <div v-for="(hit) in hits" :key="hit.hitId"
                 :class="{'bg-info': hit.type && hit.type === 'miss', 'bg-danger': hit.damage > 0}" class="hit-marker"
                 :style="{
                    left: hit.left + 'px',
                    top: hit.top + 'px',
                    'z-index': (hit.hitId + 100)
                 }">
                {{ hit.damage }}
            </div>
        </div>
    </div>
</template>
<style lang="scss">
.player-render {
    height: 100%;
    width: 100%;
    max-width: 100%;
    position: relative;
    cursor: unset !important;

    .health-bar {
        z-index: 100;
    }

    > div {
        background-repeat: no-repeat;
        background-size: contain;
        height: 100%;
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 10;
        background-position: center center;
    }


    .player-skin {
        z-index: 5;
    }

    .head {
        z-index: 35;
    }

    .player-chestplate {
        z-index: 30;
    }

    .player-helmet {
        z-index: 35;
    }

    .right-arm {
        z-index: 40;
    }

    .player-chestplate-right-arm {
        z-index: 45;
    }

    .player-leggings, .legs {
        z-index: 5;
    }

    .player-skin {
        //z-index: 10; // 10 base level
    }

    .behind {
        z-index: 2 !important;
    }

    .in-front {
        //z-index: 20;
    }

    .player-weapon {
        z-index: 50;
    }

    .hitbox {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 100;
    }
}

</style>
<script>
import {kebabCase} from "lodash/string";
import store from '../store'
import {random} from "lodash/number";

export default {
  name: 'PlayerRender',
  data() {
    return {
      store: store.state,
      hits: [],
      hitId: 0,
    }
  },
  props: {
    skin: {
      type: String,
      required: false,
    },
    equipped: {
      type: Object,
      required: false,
    }
  },
  computed: {
    getSkin() {
      return this.skin || 'default'
    },
    getPlayerSkinStyle() {
      return {'background-image': `url(/images/skins/${this.getSkin}/skin.png`};
    },
    getPlayerSkinHead() {
      return {'background-image': `url(/images/skins/${this.getSkin}/head.png`};
    },
    getPlayerSkinChest() {
      return {'background-image': `url(/images/skins/${this.getSkin}/chest.png`};
    },
    getPlayerSkinLegs() {
      return {'background-image': `url(/images/skins/${this.getSkin}/legs.png`};
    },
    getPlayerSkinLeftArm() {
      return {'background-image': `url(/images/skins/${this.getSkin}/left-arm.png`};
    },
    getPlayerSkinRightArm() {
      return {'background-image': `url(/images/skins/${this.getSkin}/right-arm.png`};
    },
    getHelmet() {
      const item = this.currentlyEquipped.find(s => s.Item.equip_slot === 'helmet');
      if (item)
        return {'background-image': `url(/images/equipment/${kebabCase(item.Item.name)}.png`};

      return false;
    },
    getChestPlate() {
      const item = this.currentlyEquipped.find(s => s.Item.equip_slot === 'chestplate');
      if (item)
        return {'background-image': `url(/images/equipment/${kebabCase(item.Item.name)}.png`};

      return false;
    },
    getChestPlateBehind() {
      const item = this.currentlyEquipped.find(s => s.Item.equip_slot === 'chestplate');
      if (item)
        return {'background-image': `url(/images/equipment/${kebabCase(item.Item.name)}-behind.png`};

      return false;
    },
    getChestPlateRightArm() {
      const item = this.currentlyEquipped.find(s => s.Item.equip_slot === 'chestplate');
      if (item)
        return {'background-image': `url(/images/equipment/${kebabCase(item.Item.name)}-right-shoulder.png`};

      return false;
    },
    getLeggings() {
      const item = this.currentlyEquipped.find(s => s.Item.equip_slot === 'leggings');
      if (item)
        return {'background-image': `url(/images/equipment/${kebabCase(item.Item.name)}.png`};

      return false;
    },
    getBoots() {
      const item = this.currentlyEquipped.find(s => s.Item.equip_slot === 'boots');
      if (item)
        return {'background-image': `url(/images/equipment/${kebabCase(item.Item.name)}.png`};

      return false;
    },
    getWeapon() {
      const item = this.currentlyEquipped.find(s => s.Item.equip_slot === 'weapon');
      if (item)
        return {'background-image': `url(/images/equipment/${kebabCase(item.Item.name)}.png`};

      return false;
    },
    getWeaponName() {
      const item = this.currentlyEquipped.find(s => s.Item.equip_slot === 'weapon');

      if (item)
        return kebabCase(item.Item.name)

      return false;
    },
    currentlyEquipped() {
      const inventory = this.equipped || this.store.user.inventory;

      return inventory.filter(s => {
        return s.equipped === true
      });
    },
    health() {
      return this.store.user.character.health
    },
    max_health() {
      return this.store.user.character.max_health
    },
    healthWidth() {
      if(this.health <= 0)
        return 0;

      return (100 / this.max_health) * this.health
    }
  },
  sockets: {
    'monster attack'(attack) {
      if (attack.enemy.character.username === this.store.user.character.username) {
        this.hitId++;
        this.hits.push(Object.assign({
          hit_id: this.hitId,
          left: random(30, this.$refs.player.clientWidth - 60),
          top: random(30, this.$refs.player.clientHeight - 60),
        }, attack));
      }
    },
    'combat finished'() {
      console.log('combat finished')
      this.hits = []
    }
  }
}
</script>
