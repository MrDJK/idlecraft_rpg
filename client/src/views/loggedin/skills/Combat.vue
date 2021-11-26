<template>
    <div class="h-100 combat-page">
        <div v-if="!isInCombat">
            <div class="page-header mb-4 p-4">
                <h1 class="d-flex align-items-center">
                    <mc-icon :skill="'combat'" class="d-inline-block me-2"></mc-icon>
                    Combat
                </h1>
                <GameTip/>
            </div>
            <div class="container-fluid">
                <div class="row just">
                    <div class="col-sm-12 col-md-6 col-xl-4 col-xxxl-3" v-for="(skill, index) in skills" :key="index">
                        <Skillbox :skill="skill"/>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="combat-grid d-flex flex-column">
            <button @click="leave" class="btn btn-danger position-absolute run-away">Run away from here</button>

            <div v-if="combat.stage === 'waiting for fight'" class="text-center">
                Waiting for a new fight..
            </div>

            <div v-if="isInCombat" class="d-flex flex-row player-mob-container"
                 :class="{'waiting-for-fight-animation': combat.stage === 'waiting for fight'}">
                <div>
                    <div v-for="(friendly, index) in store.combat.friendly" :key="index" class="model-render">
                        <PlayerRender :equipped="friendly.inventory" :skin="friendly.character.skin"/>
                        <SocketProgressBar :skill="{id: `player-combat-${friendly.name}`}"/>
                    </div>
                </div>

                <div>
                    <monster :monster="enemy" v-for="(enemy, index) in store.combat.enemies" :key="index"
                             class="model-render"></monster>
                </div>
            </div>
        </div>

        <div class="text-center combat-inventory">
            <ul class="list-unstyled mb-0 mx-auto d-inline-block">
                <li v-for="item in combatInventorySize" :key="item" class="d-inline-block p-2">
                    <Item :item="inventory[item - 1]" :size="48"
                          @click="consume(inventory[item - 1])"
                          hide-quantity
                          class="cursor-pointer"
                          v-if="inventory[item - 1]"/>
                    <mc-icon icon="cooked-chicken"
                             class="item-unequipped"
                             :size="48"
                             v-else />
                </li>
            </ul>
        </div>
    </div>
</template>
<style lang="scss" scoped>
</style>
<script>
import Skillbox from "../../../components/SkillBox";
import store from '../../../store'
import SocketProgressBar from "../../../components/SocketProgressBar";
import Monster from "../../../components/Monster";
import PlayerRender from "../../../components/PlayerRender";
import Item from "../../../components/Item";
import McIcon from "../../../components/McIcon";
import GameTip from "../../../components/GameTip";

export default {
  name: 'Combat',
  components: {GameTip, McIcon, Item, PlayerRender, Monster, SocketProgressBar, Skillbox},
  data() {
    return {
      hideUI: false,
      store: store.state,
    }
  },
  computed: {
    skills() {
      return this.store.skills && this.store.skills.filter(i => i.skill === 'combat')
    },
    isInCombat() {
      return this.store.combat.inProgress;
    },
    combat() {
      return this.store.combat
    },
    inventory() {
      return this.store.user.inventory.filter(i => i.combat_inventory)
        .sort((a, b) => {
          if (a.Item.name > b.Item.name)
            return 1;

          if (a.Item.name < b.Item.name)
            return -1;

          return 0;
        });
    },
    combatInventorySize() {
      return 8;
    }
  },
  methods: {
    leave() {
      this.$socket.emit('auth:stop skill')
    },
    consume(item) {
      if (this.store.combat.inProgress)
        this.$socket.emit("consume combat inventory", item.id)
      else
        this.$socket.emit("remove from combat inventory", item.id)
    }
  },
  sockets: {
    "enter combat": function (fight) {
      this.store.combat.inProgress = true;
      this.store.combat.friendly = fight.friendlyTeam
      this.store.combat.enemies = fight.enemyTeam;
      this.hideUI = false;
    },
    "player attack": function (attack) {
      const monster = this.store.combat.enemies.findIndex(i => i.id === attack.enemy.id);
      console.log(attack, monster);
      this.store.combat.enemies[monster] = attack.enemy;
      this.hideUI = false;
    },
    'stop skill': function () {
      this.store.combat.inProgress = false;
      this.store.combat.friendly = [];
      this.store.combat.enemies = [];
    },
    'killed monster': function () {

    },
    'monster attack'(attack) {
      for (const player in this.store.combat.friendly) {
        console.log('playyyyyerrrr', this.store.combat.friendly[player])

        this.store.combat.friendly[player] = attack.enemy
      }

    },
    "refresh fight": function () {
      this.hideUI = true;
    },
    "test combat"() {
      console.log('yep yep yep yep')
    },
    'change stage'(stage) {
      this.store.combat.stage = stage;
    }
  }
}
</script>
