<template>
    <div class="item d-flex flex-column text-center">
        <v-tooltip v-if="validItem">
            <div class="mc-icon" :class="[getImageClass, getIconSizeClass]" />
            <span class="badge bg-gradient amount" v-if="!hideQuantity && itemQuantity"
            :class="{
              'bg-secondary' : !this.invalidAmount,
              'bg-danger': this.invalidAmount
            }">x{{ itemQuantity }}</span>

            <template #popper>
                <div class="mc-icon icon-size-32 float-end" :class="[getImageClass]"></div>
                <h5>{{ itemName }}</h5>
                <p v-if="description" v-html="description"></p>
                <table class="table table-borderless text-white table-bordered border-dark item-stats-table" v-if="statsTable">
                    <tbody>
                    <tr v-for="(stat, index) in statsTable" :key="index">
                        <td>{{ formatAttribute(stat.attribute) }}</td>
                        <td>{{ stat.value }}</td>
                    </tr>
                    <tr v-for="(stat, index) in enchantments" :key="index">
                        <td>{{ stat.enchantment_name }}</td>
                        <td>{{ stat.enchantment_strength }}</td>
                    </tr>
                    </tbody>
                </table>
            </template>
        </v-tooltip>
    </div>
</template>
<style lang="scss">
.item {
    display: flex;
    position: relative;

    .amount {
        position: absolute;
        bottom: 5px;
        right: 5px;
        font-size: 10px;
        padding: 2px 5px;
    }
}


.rainbowText {
    background-color: #1fe3c8;
    background-image: linear-gradient(45deg, transparent, #02e399, rgba(0, 0, 0, 0.3), #02e399, transparent) !important;

    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: move 15s infinite linear;
}

@keyframes move {
    from {
        background-position: 0 0;
    }
    to {
        background-position: 100vh;
    }
}

</style>
<script>

import {startCase, toLower} from "lodash/string";

export default {
  name: 'Item',
  data() {
    return {}
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
    size: {
      type: Number,
      default: 64
    },
    quantity: {
      type: Number,
    },
    invalidAmount: {
      type: Boolean,
      default: false
    },
    hideQuantity: {
      type: Boolean,
      default: false,
    },
    events: {
      type: Boolean,
      default: false
    }
  },
  created() {
  },
  methods: {
    formatAttribute(attr) {
      return startCase(toLower(attr))
    },
    kFormatter(num) {
      return Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k' : Math.sign(num)*Math.abs(num)
    }
  },
  computed: {
    itemName() {

      if (this.item.item)
        return this.item.item.name;

      return this.item.ItemAttributes?.find(n => n.attribute === 'name')?.value || this.item.name || this.item.Item.name

    },
    getImageClass() {
      const icon = this.item.ItemAttributes?.find(n => n.attribute === 'icon')?.value || this.itemName.replace(/[^\w\s]/gi, '').toLowerCase().split(' ').join('-')
      return 'icon-' + icon
    },
    getIconSizeClass() {
      return `icon-size-${this.size}`
    },
    statsTable() {

      if (!this.item.ItemAttributes)
        return;

      const ds = [
        'attack',
        'defense',
        'armor_penetration',
        'speed'
      ]
      return this.item.ItemAttributes.filter(n => ds.includes(n.attribute))
    },
    enchantments() {
      return this.item.ItemEnchantments;
    },
    description() {
      return this.item.ItemAttributes?.find(n => n.attribute === 'description')?.value;
    },
    validItem() {
      return Object.keys(this.item).length > 0;
    },
    itemQuantity() {
      const quantity = this.quantity || this.item.amount;

      return this.kFormatter(quantity)
    }
  }
}
</script>
