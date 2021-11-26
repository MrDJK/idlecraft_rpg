<template>
    <div id="equipment" class="d-flex flex-column ui-window">
        <div class="header bg-dark-blue-grad py-2 px-3 d-flex flex-row align-items-center">
            <mc-icon icon="chest" :size="36" class="me-2" /><h5 class="mb-0">Equipment</h5>
        </div>
        <ul class="list-unstyled p-2 bg-black">
            <li v-for="(item, index) in inventory" :key="index" class="d-inline-block" draggable="true"
                @dragstart="dragStart($event, item)">
                <Item :item="item" :size="48"/>
            </li>
        </ul>
    </div>
</template>
<script>
import store from '../../store'
import Item from "../Item";
import McIcon from "../McIcon";

export default {
  components: {McIcon, Item},
  computed: {
    inventory() {
      return store.state.user.inventory;
    }
  },
  methods: {
    dragStart(e, item) {
      console.log('dragsrat', e, item)
      e.dataTransfer.setData("text/plain", item.id);
    }
  }
}
</script>
