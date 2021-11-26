<template>
    <div class="bg-black p-2 pe-2 w-100 d-flex justify-content-center align-items-center">
        <div class="copyright small text-muted me-auto">&copy; Idle Craft, Minecraft is copyright Mojang AB. We are not affiliated</div>
        <div class="me-auto">
            <v-tooltip>
                <mc-icon icon="diamond-chestplate" :size="32" class="cursor-pointer" @click="openEquipment"/>
                <template #popper>
                    Equipment
                </template>
            </v-tooltip>
            <v-tooltip>
                <mc-icon icon="chest" :size="32" @click="openInventory" class="cursor-pointer ms-3"/>
                <template #popper>
                    Inventory
                </template>
            </v-tooltip>
            <template class="d-inline-block d-md-none">
                <v-tooltip>
                    <mc-icon icon="oak-sign" :size="32" @click="openChat" class="cursor-pointer ms-3"/>
                    <template #popper>
                        Open Chat
                    </template>
                </v-tooltip>
            </template>
        </div>
    </div>
</template>
<script>
import McIcon from "../McIcon";
import store from "../../store"
import {nextTick} from "vue";

export default {
  components: {McIcon},
  data() {
    return {
      store: store.state,
    }
  },
  methods: {
    openInventory() {
      const state = !this.store.layout.inventoryOpen;
      this.closeScreens();

      console.log('inv', state)

      this.store.layout.inventoryOpen = state;
    },
    openEquipment() {
      this.$router.push({
        name: 'Equipment'
      })
    },
    openChat() {
      const state = !this.store.layout.chatMobileOpen;
      this.closeScreens()

      this.store.layout.chatMobileOpen = state;
      console.log('chat', state)

      setTimeout(() => {
        if (state === true) {
          nextTick(() => {
            const chatBox = document.getElementById("chat-messages");
            const messageList = chatBox.getElementsByTagName('ul')[0];

            console.log('scrolling chat on open', chatBox, messageList)
            chatBox.scrollTop = chatBox.scrollHeight + 300;

          });
        }
      })
    },
    closeScreens() {
      this.store.layout.chatMobileOpen = false;
      this.store.layout.equipmentOpen = false;
      this.store.layout.inventoryOpen = false;
    }
  }
}
</script>
