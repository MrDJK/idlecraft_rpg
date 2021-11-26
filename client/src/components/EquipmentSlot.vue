<template>
    <div :id="getId" class="equipment-slot">
        <mc-icon :icon="getIcon" :class="{'item-unequipped': !currentlyEquipped}"
                 v-if="!currentlyEquipped" :size="48"/>
        <Item :item="currentlyEquipped" v-if="currentlyEquipped" :hide-quantity="true" @click="unequip" :size="48" class="m-0"/>
    </div>
</template>

<script>
import store from '../store'

import McIcon from "./McIcon";
import Item from "./Item";

export default {
  name: 'EquipmentSlot',
  components: {Item, McIcon},
  data() {
    return {
      store: store.state
    }
  },
  props: {
    type: {
      type: String,
      required: true,
    }
  },
  methods: {
    unequip() {
      this.$socket.emit("unequip item", this.currentlyEquipped.id)
    }
  },
  computed: {
    getId() {
      return `equipment-slot-${this.type}`
    },
    getIcon() {

      if (this.type === 'weapon')
        return `diamond-sword`;

      return `diamond-${this.type}`
    },
    currentlyEquipped() {
      return this.store.user.inventory.find(s => {
        return s.Item.equip_slot === this.type && s.equipped === true
      });
    }
  }
}
</script>
