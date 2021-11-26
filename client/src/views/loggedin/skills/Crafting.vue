<template>
    <div>
        <div class="page-header mb-4 p-4">
            <h1 class="d-flex align-items-center">
                <mc-icon :skill="'crafting'" class="d-inline-block me-2"></mc-icon>
                Crafting
            </h1>
            <p>Craft a sword or a pickaxe, maybe some armor? Drag and drop from your inventory onto the grid below</p>
            <GameTip/>
        </div>

        <div class="d-flex justify-content-center align-items-center w-100 flex-column">
            <div class="crafting-table w-50">
                <div v-for="(craftingSlot, index) in table" :key="index"
                     @dragover="dragOver"
                     @dragenter="dragEnter"
                     @dragleave="dragLeave"
                     @drop="drop"
                     class="border-1 border-info crafting-slot d-flex justify-content-center align-items-center"
                     :data-crafting-slot="index"
                >
                    <div style="height: 70px;" v-if="craftingSlot.item">
                        <Item :item="craftingSlot.item" hide-quantity/>
                    </div>
                </div>
            </div>
            <div>
                <button @click="craft">Craft</button>

                <button @click="fillTable">Reset table</button>
            </div>
        </div>
    </div>
</template>
<style lang="scss">
.crafting-table {
    display: flex;
    flex-wrap: wrap;
    width: 100%;

    > div {
        height: 128px;
        border: 1px solid black;
        width: 33%;
    }
}
</style>
<script>
import store from '../../../store'
import Item from "../../../components/Item";
import {fill} from "lodash/array";
import McIcon from "../../../components/McIcon";
import GameTip from "../../../components/GameTip";

export default {
  name: 'Crafting',
  components: {GameTip, McIcon, Item},
  data() {
    return {
      store: store.state,
      table: []
    }
  },
  created() {
    this.fillTable()
  },
  methods: {
    fillTable() {
      this.table = fill(Array(9), {})
    },
    dragOver(e) {
      if (!e)
        return;

      console.log('over');
      e.target.classList.add('bg-secondary')
      e.preventDefault()

    },
    dragEnter(e) {
      if (!e)
        return;

      console.log('enter');
    },
    dragLeave(e) {
      if (!e)
        return;

      console.log('leave');
      e.target.classList.remove('bg-secondary')
    },
    getItemFromId(itemId) {
      console.log(
        'finding item',
        this.store.user.inventory.find(i => i.id === Number(itemId))
      )
      return this.store.user.inventory.find(i => i.id === Number(itemId))
    },
    craft() {
      this.$socket.emit("craft", this.table.map(i => i.id || 0))
    },
    drop(e) {
      if (!e)
        return;

      const item = e.dataTransfer.getData('text/plain');
      const target = e.target.dataset.craftingSlot;

      console.log('dropped', item, 'into slot', target);

      this.table[target] = {
        item: this.getItemFromId(item),
        id: item
      };
      e.target.classList.remove('bg-secondary')

      e.preventDefault();
    }
  },
  computed: {},
  sockets: {}
}
</script>
