<template>
    <div id="inventory" class="d-flex flex-column ui-window">
        <div class="header bg-dark-blue-grad py-2 px-3 d-flex flex-row align-items-center" @click="close">
            <mc-icon icon="chest" :size="36" class="me-2"/>
            <h5 class="mb-0">Inventory</h5>
        </div>
        <div class="sub-header d-flex flex-row justify-content-around py-2">

            <v-tooltip>
                <div class="d-flex flex-row align-items-center">
                    <mc-icon icon="currency" :size="16" class="me-2 d-inline-block" :custom="true"/>

                    <vue3autocounter ref='gold_counter'
                                     :startAmount='currency.previous'
                                     :endAmount='currency.current'
                                     :duration='1'
                                     :autoinit='true'/>
                </div>
                <template #popper>
                    Currency
                </template>
            </v-tooltip>
            <v-tooltip>

                <div class="d-flex flex-row align-items-center">
                    <mc-icon icon="coal" :size="16" class="me-2"/>
                    <vue3autocounter ref='heat_counter'
                                     :startAmount='heat.previous'
                                     :endAmount='heat.current'
                                     :duration='1'
                                     :autoinit='true'/>
                </div>
                <template #popper>
                    Heat
                </template>
            </v-tooltip>
        </div>
        <ul class="list-unstyled p-2">
            <li v-for="(item, index) in inventory" :key="index" class="d-inline-block" draggable="true"
                @dragstart="dragStart($event, item)"
                @click="openContextMenu(item)">
                <Item :item="item" :size="48"/>
            </li>
        </ul>
    </div>
</template>
<script>
import store from '../../store'
import Item from "../Item";
import McIcon from "../McIcon";
import Vue3autocounter from 'vue3-autocounter';

export default {
  components: {McIcon, Item, Vue3autocounter},
  data() {
    return {
      store: store.state,
      currency: {
        current: 0,
        previous: 0,
      },
      heat: {
        current: 0,
        previous: 0,
      }
    }
  },
  mounted() {
    this.currency.current = this.store.user.character.gold;
    this.heat.current = this.store.user.character.heat;
    this.$refs.gold_counter.start();
    this.$refs.heat_counter.start();
  },
  computed: {
    inventory() {
      return store.state.user.inventory.filter(i => !i.equipped && !i.combat_inventory)
        .sort((a, b) => {
          if (a.Item.name > b.Item.name)
            return 1;

          if (a.Item.name < b.Item.name)
            return -1;

          return 0;
        });
    },
  },
  methods: {
    dragStart(e, item) {
      console.log('dragsrat', e, item)
      e.dataTransfer.setData("text/plain", item.id);
    },
    openContextMenu(item) {
      console.log("opening menu")
      store.state.layout.itemModel.item = item
      store.state.layout.itemModel.show = true
    },
    close() {
      this.store.layout.inventoryOpen = false;
    }
  },
  sockets: {
    'character update'(character) {
      for (const stat in character) {
        if(stat === 'gold') {
          this.currency.previous = this.currency.current;
          this.currency.current = character[stat]
        } else if(stat === 'heat') {
          this.heat.previous = this.heat.current;
          this.heat.current = character[stat]
        }
      }
    }
  }
}
</script>
