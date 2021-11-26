<template>
    <div class="modal bg-dark-opacity" :class="{'show fade d-block': this.shouldShow}" tabindex="-1" @click="close">
        <div class="modal-dialog bg-dark" @click.stop>
            <div class="modal-content bg-dark border-dark">
                <div class="modal-header border-0">
                    <h5 class="modal-title">Item</h5>
                    <button type="button" class="btn-close text-white bg-white" data-bs-dismiss="modal"
                            aria-label="Close"
                            @click="close"></button>
                </div>
                <div class="modal-body d-flex flex-column gap-2">
                    <template v-if="(canSell || canEat || canUseAsHeat) && item.Item.stackable">
                        Quantity to use: {{ quantityToUse }}

                        <input type="range" min="1" :max="item.amount" v-model="quantityToUse"/>
                    </template>
                    <template v-if="canEquip">
                        <button class="btn btn-primary" v-if="!item.equipped" @click="equip">Equip</button>
                        <button class="btn btn-primary" v-if="item.equipped" @click="unequip">Un Equip</button>
                    </template>
                    <template v-if="canEat">
                        <button class="btn btn-primary" @click="eat">Eat for {{ potentialHealth }} health</button>
                    </template>
                    <template v-if="canOpen">
                        <button class="btn btn-primary" @click="open">Open</button>
                    </template>
                    <template v-if="canUseAsHeat">
                        <button class="btn btn-primary" @click="consumeForHeat">Consume for {{ potentialHeat }} heat</button>
                    </template>
                    <template v-if="canCombatInventory">
                        <button class="btn btn-primary" @click="addToCombatInventory">Add {{ quantityToUse }} to combat inventory</button>
                    </template>
                    <template v-if="canSell">
                        <button class="btn btn-primary" @click="sell">Sell</button>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import store from '../store'

export default {
  name: 'Modal',
  data() {
    return {
      state: store.state,
      quantityToUse: 1,
    }
  },
  methods: {
    close() {
      this.state.layout.itemModel.show = false;
    },
    equip() {
      this.$socket.emit('equip item', this.item.id);
      this.close();
    },
    unequip() {
      this.$socket.emit('unequip item', this.item.id);
      this.close();
    },
    open() {
      this.$socket.emit('open item', this.item.id);
      this.close();
    },
    addToCombatInventory() {
      this.$socket.emit('add to combat inventory', {
        item: this.item.id,
        amount: this.quantityToUse
      });
      this.close();
    },
    eat() {
      console.log(this.item);
      this.$socket.emit('eat item', {
        item: this.item.id,
        amount: this.quantityToUse,
        i: this.item
      });
      this.close();
    },
    consumeForHeat() {
      this.$socket.emit('consume for heat', {
        item: this.item.id,
        amount: this.quantityToUse
      });
      this.close();
    },
    sell() {
      this.$socket.emit('sell item', {
        item: this.item.id,
        amount: this.quantityToUse
      });
      this.close();
    }
  },
  computed: {
    shouldShow() {
      return this.state.layout.itemModel.show
    },
    item() {
      return this.state.layout.itemModel.item;
    },
    canEquip() {
      return this.item.Item.equippable
    },
    canEat() {
      return this.item.Item.can_eat
    },
    canOpen() {
      return this.item.Item.can_open
    },
    canSell() {
      return this.item.Item.can_sell
    },
    canUseAsHeat() {
      return this.item.Item.heat > 0
    },
    canCombatInventory() {
      return this.item.Item.combat_inventory
    },
    potentialHealth() {
      return new Intl.NumberFormat().format(this.item.Item.health_given * this.quantityToUse)
    },
    potentialHeat() {
      return new Intl.NumberFormat().format(this.item.Item.heat * this.quantityToUse)
    }
  }
}
</script>
